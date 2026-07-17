<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, private, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');
header('X-Accel-Expires: 0');
header('Vary: Cookie');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

const SESSION_COOKIE = 'technoshine_session';
const MAX_IMAGE_UPLOAD_BYTES = 50 * 1024 * 1024;
const OPTIMIZED_IMAGE_TARGET_BYTES = 3 * 1024 * 1024;
const OPTIMIZED_IMAGE_MAX_DIMENSION = 2400;
const OPTIMIZED_IMAGE_START_QUALITY = 84;
const OPTIMIZED_IMAGE_MIN_QUALITY = 62;

function respond(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function body(): array
{
    $payload = json_decode(file_get_contents('php://input') ?: '', true);
    return is_array($payload) ? $payload : [];
}

function db(): PDO
{
    $host = getenv('TECHNOSHINE_DB_HOST') ?: '127.0.0.1';
    $name = getenv('TECHNOSHINE_DB_NAME') ?: 'technoshine_data';
    $user = getenv('TECHNOSHINE_DB_USER') ?: 'root';
    $pass = getenv('TECHNOSHINE_DB_PASS') ?: '';

    $pdo = new PDO(
        "mysql:host={$host};dbname={$name};charset=utf8mb4",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );

    // Keep TIMESTAMP reads and SQL date comparisons on the same clock on every host.
    // A numeric offset works even when MySQL time-zone tables are not installed.
    $pdo->exec("SET time_zone = '+00:00'");

    return $pdo;
}

function utcDateTime(string $value): string
{
    return (new DateTimeImmutable($value, new DateTimeZone('UTC')))
        ->format(DateTimeInterface::ATOM);
}

function sessionCookieOptions(int $expires): array
{
    $isSecure = (
        (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ||
        (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https')
    );

    return [
        'expires' => $expires,
        'path' => '/',
        'secure' => $isSecure,
        'httponly' => true,
        'samesite' => 'Lax',
    ];
}

function setSessionCookie(string $token, bool $remember): void
{
    $expires = $remember ? time() + 60 * 60 * 24 * 30 : 0;
    setcookie(SESSION_COOKIE, $token, sessionCookieOptions($expires));
}

function clearSessionCookie(): void
{
    setcookie(SESSION_COOKIE, '', sessionCookieOptions(time() - 3600));
}

function currentUser(PDO $pdo): ?array
{
    $token = $_COOKIE[SESSION_COOKIE] ?? '';
    if (!is_string($token) || $token === '') {
        return null;
    }

    $statement = $pdo->prepare(
        'SELECT users.id, users.email, users.role, sessions.remember_me, sessions.created_at, sessions.expires_at
         FROM sessions
         INNER JOIN users ON users.id = sessions.user_id
         WHERE sessions.token_hash = :token_hash
           AND sessions.expires_at > UTC_TIMESTAMP()
         LIMIT 1'
    );
    $statement->execute(['token_hash' => hash('sha256', $token)]);
    $user = $statement->fetch();

    return $user ?: null;
}

function requireUser(PDO $pdo): array
{
    $user = currentUser($pdo);
    if (!$user) {
        respond(401, ['ok' => false, 'message' => 'Unauthenticated.']);
    }

    return $user;
}

function priceLabel(float $price): string
{
    return '₱' . number_format($price, 0);
}

function productFromRow(array $row): array
{
    $useFor = json_decode((string)($row['use_for'] ?? '[]'), true);
    $howToUse = json_decode((string)($row['how_to_use'] ?? '[]'), true);
    $visual = json_decode((string)($row['visual'] ?? '{}'), true);
    $price = (float)$row['price'];

    return [
        'id' => (string)$row['id'],
        'slug' => (string)$row['slug'],
        'brand' => (string)$row['brand'],
        'name' => (string)$row['name'],
        'category' => (string)$row['category'],
        'size' => (string)$row['size'],
        'useFor' => is_array($useFor) ? $useFor : [],
        'usesLine' => (string)$row['usage_short'],
        'price' => $price,
        'priceLabel' => priceLabel($price),
        'stockLeft' => (int)$row['stock'],
        'badge' => $row['badge'] ?: null,
        'imageUrl' => $row['image_url'] ?: '',
        'description' => (string)($row['description'] ?? ''),
        'howToUse' => is_array($howToUse) ? $howToUse : [],
        'shopeeUrl' => (string)($row['shopee_url'] ?? ''),
        'visual' => is_array($visual) && $visual ? $visual : [
            'accent' => '#FF6B00',
            'surface' => '#FFF8F2',
            'label' => (string)$row['category'],
        ],
        'isPublished' => (bool)$row['is_published'],
        'createdAt' => (string)$row['created_at'],
        'updatedAt' => (string)$row['updated_at'],
    ];
}

function employeeFromRow(array $row): array
{
    return [
        'id' => (string)$row['id'],
        'name' => (string)$row['name'],
        'position' => (string)$row['position'],
        'department' => (string)$row['department'],
        'orgGroup' => (string)($row['org_group'] ?? 'staff'),
        'employeeId' => (string)$row['employee_id'],
        'reportsTo' => (string)($row['reports_to_employee_id'] ?? ''),
        'photoUrl' => (string)($row['photo_url'] ?? ''),
        'isPublished' => ($row['status'] ?? 'active') === 'active' && empty($row['deleted_at']),
        'deletedAt' => $row['deleted_at'] ?: null,
    ];
}

function ensureEmployeeOrgGroupColumn(PDO $pdo): void
{
    $database = (string)$pdo->query('SELECT DATABASE()')->fetchColumn();
    $statement = $pdo->prepare(
        "SELECT COUNT(*)
         FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = :database
           AND TABLE_NAME = 'employees'
           AND COLUMN_NAME = 'org_group'"
    );
    $statement->execute(['database' => $database]);

    if ((int)$statement->fetchColumn() > 0) {
        return;
    }

    $pdo->exec(
        "ALTER TABLE employees
         ADD COLUMN org_group ENUM('board', 'leadership', 'dept', 'staff') NOT NULL DEFAULT 'staff'
         AFTER department"
    );
    $pdo->exec(
        "UPDATE employees
         SET org_group = CASE
           WHEN department = 'Board / Ownership' THEN 'board'
           WHEN department = 'Leadership' THEN 'leadership'
           WHEN employee_id IN ('ORG-TECH-001', '23-003', '24-015', 'ORG-IT-001') THEN 'dept'
           ELSE 'staff'
         END"
    );
}

function migrateEmployeeHierarchy(PDO $pdo): void
{
    $updates = [
        ['ORG-OPSMGR-001', 'Operations Mgr', 'ORG-TECH-001', 'Operations Manager 1', 'ORG-TECH-001'],
        ['ORG-OPSMGR-002', 'Operations Mgr', 'ORG-TECH-001', 'Operations Manager 2', 'ORG-TECH-001'],
        ['26-001', 'Rider Liaison', '24-015', 'Rider / Liaison', 'MLR-001'],
        ['ORG-OFFICEAID-001', 'Office Aid', '24-015', 'Office Aide', 'MLR-001'],
        ['ORG-ITASSIST-001', 'IT Assistant', 'ORG-GRAPHIC-001', 'IT Assistant', 'ORG-IT-001'],
    ];
    $statement = $pdo->prepare(
        "UPDATE employees
         SET position = :position,
             reports_to_employee_id = :reports_to
         WHERE employee_id = :employee_id
           AND position = :legacy_position
           AND COALESCE(reports_to_employee_id, '') = :legacy_reports_to"
    );

    foreach ($updates as [$employeeId, $legacyPosition, $legacyReportsTo, $position, $reportsTo]) {
        $statement->execute([
            'employee_id' => $employeeId,
            'legacy_position' => $legacyPosition,
            'legacy_reports_to' => $legacyReportsTo,
            'position' => $position,
            'reports_to' => $reportsTo,
        ]);
    }
}

function ensureSocialReelsTable(PDO $pdo): void
{
    $database = (string)$pdo->query('SELECT DATABASE()')->fetchColumn();
    $exists = $pdo->prepare(
        "SELECT COUNT(*)
         FROM INFORMATION_SCHEMA.TABLES
         WHERE TABLE_SCHEMA = :database
           AND TABLE_NAME = 'social_reels'"
    );
    $exists->execute(['database' => $database]);
    $tableAlreadyExists = (int)$exists->fetchColumn() > 0;

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS social_reels (
          id VARCHAR(80) NOT NULL,
          title VARCHAR(190) NOT NULL,
          href VARCHAR(500) NOT NULL,
          sort_order INT UNSIGNED NOT NULL DEFAULT 0,
          is_published TINYINT(1) NOT NULL DEFAULT 1,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          KEY social_reels_sort_order_index (sort_order),
          KEY social_reels_is_published_index (is_published)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    if ($tableAlreadyExists) {
        return;
    }

    $statement = $pdo->prepare(
        'INSERT INTO social_reels (id, title, href, sort_order, is_published)
         VALUES (:id, :title, :href, :sort_order, :is_published)'
    );

    $seedReels = [
        ['company-reel-01', 'Project Reel 01', 'https://www.facebook.com/reel/830650776652467', 1],
        ['company-reel-02', 'Project Reel 02', 'https://www.facebook.com/reel/4472370363007058', 2],
    ];

    foreach ($seedReels as $reel) {
        $statement->execute([
            'id' => $reel[0],
            'title' => $reel[1],
            'href' => $reel[2],
            'sort_order' => $reel[3],
            'is_published' => 1,
        ]);
    }
}

function ensureGalleryImagesTable(PDO $pdo): void
{
    $database = (string)$pdo->query('SELECT DATABASE()')->fetchColumn();
    $exists = $pdo->prepare(
        "SELECT COUNT(*)
         FROM INFORMATION_SCHEMA.TABLES
         WHERE TABLE_SCHEMA = :database
           AND TABLE_NAME = 'gallery_images'"
    );
    $exists->execute(['database' => $database]);
    $tableAlreadyExists = (int)$exists->fetchColumn() > 0;

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS gallery_images (
          id VARCHAR(80) NOT NULL,
          title VARCHAR(190) NOT NULL,
          location VARCHAR(190) NOT NULL DEFAULT '',
          image_url VARCHAR(500) NOT NULL,
          alt_text VARCHAR(255) NOT NULL DEFAULT '',
          sort_order INT UNSIGNED NOT NULL DEFAULT 0,
          is_featured TINYINT(1) NOT NULL DEFAULT 0,
          is_hero TINYINT(1) NOT NULL DEFAULT 0,
          is_published TINYINT(1) NOT NULL DEFAULT 1,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          KEY gallery_images_sort_order_index (sort_order),
          KEY gallery_images_is_published_index (is_published),
          KEY gallery_images_is_featured_index (is_featured),
          KEY gallery_images_is_hero_index (is_hero)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    if ($tableAlreadyExists) {
        return;
    }

    $statement = $pdo->prepare(
        'INSERT INTO gallery_images
          (id, title, location, image_url, alt_text, sort_order, is_featured, is_hero, is_published)
         VALUES
          (:id, :title, :location, :image_url, :alt_text, :sort_order, :is_featured, :is_hero, :is_published)'
    );

    $seedImages = [
        ['gallery-1', 'Marble Floor Polish', 'Polished stone surface', 'images/client-images/gallery-1.jpg', 1, 0],
        ['gallery-2', 'Commercial Hallway', 'High-traffic stone care', 'images/client-images/gallery-2.jpg', 2, 1],
        ['gallery-3', 'Hotel Lobby Restoration', 'Premium floor finish', 'images/client-images/gallery-3.jpg', 3, 1],
        ['gallery-9', 'Interior Floor Care', 'Detail cleaning', 'images/client-images/gallery-9.jpg', 4, 1],
        ['gallery-10', 'Detail Cleaning', 'Natural stone polishing', 'images/client-images/gallery-10.jpg', 5, 0],
        ['gallery-11', 'Natural Stone Polishing', 'Premium floor finish', 'images/client-images/gallery-11.jpg', 6, 0],
        ['gallery-12', 'Premium Floor Finish', 'Restored stone shine', 'images/client-images/gallery-12.jpg', 7, 0],
        ['gallery-13', 'Gloss Recovery', 'Surface refinishing', 'images/client-images/gallery-13.jpg', 8, 0],
        ['gallery-14', 'Surface Refinishing', 'Protected polished floor', 'images/client-images/gallery-14.jpg', 9, 0],
        ['gallery-15', 'Protected Finish', 'Polished stone surface', 'images/client-images/gallery-15.jpg', 10, 0],
    ];

    foreach ($seedImages as [$id, $title, $location, $imageUrl, $sortOrder, $isHero]) {
        $statement->execute([
            'id' => $id,
            'title' => $title,
            'location' => $location,
            'image_url' => $imageUrl,
            'alt_text' => $title,
            'sort_order' => $sortOrder,
            'is_featured' => $sortOrder <= 3 ? 1 : 0,
            'is_hero' => $isHero,
            'is_published' => 1,
        ]);
    }
}

function ensureVisitorSessionsTable(PDO $pdo): void
{
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS visitor_sessions (
          visitor_id VARCHAR(80) NOT NULL,
          last_path VARCHAR(500) NOT NULL DEFAULT '/',
          user_agent_hash CHAR(64) NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          last_seen_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (visitor_id),
          KEY visitor_sessions_last_seen_index (last_seen_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
}

function ensureTestimonialsTable(PDO $pdo): void
{
    $database = (string)$pdo->query('SELECT DATABASE()')->fetchColumn();
    $exists = $pdo->prepare(
        "SELECT COUNT(*)
         FROM INFORMATION_SCHEMA.TABLES
         WHERE TABLE_SCHEMA = :database
           AND TABLE_NAME = 'testimonials'"
    );
    $exists->execute(['database' => $database]);
    $tableAlreadyExists = (int)$exists->fetchColumn() > 0;

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS testimonials (
          id VARCHAR(80) NOT NULL,
          quote_text TEXT NOT NULL,
          client_name VARCHAR(190) NOT NULL,
          rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
          sort_order INT UNSIGNED NOT NULL DEFAULT 0,
          is_published TINYINT(1) NOT NULL DEFAULT 1,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          KEY testimonials_sort_order_index (sort_order),
          KEY testimonials_is_published_index (is_published)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    if ($tableAlreadyExists) {
        return;
    }

    $statement = $pdo->prepare(
        'INSERT INTO testimonials (id, quote_text, client_name, rating, sort_order, is_published)
         VALUES (:id, :quote_text, :client_name, :rating, :sort_order, :is_published)'
    );

    $seedTestimonials = [
        [
            'hotel-lobby-client',
            'The lobby floor looked dull before the service. After polishing, the shine came back and the space looked ready for guests again.',
            'Hotel Lobby Client',
        ],
        [
            'marble-restoration-client',
            'Technoshine explained the process clearly, protected the area, and finished the marble restoration with a clean glossy result.',
            'Marble Restoration Client',
        ],
        [
            'commercial-tile-client',
            'Our tiles had heavy stains from daily traffic. The team cleaned the surface well and made the floor much easier to maintain.',
            'Commercial Tile Client',
        ],
        [
            'granite-care-client',
            'The granite counters looked newer after treatment. We appreciated the careful work and the simple maintenance advice after the job.',
            'Granite Care Client',
        ],
        [
            'property-admin-client',
            'The before and after difference was easy to see. We would recommend Technoshine for clients who need professional stone care.',
            'Property Admin Client',
        ],
    ];

    foreach ($seedTestimonials as $index => [$id, $quote, $clientName]) {
        $statement->execute([
            'id' => $id,
            'quote_text' => $quote,
            'client_name' => $clientName,
            'rating' => 5,
            'sort_order' => $index + 1,
            'is_published' => 1,
        ]);
    }
}

function contentFromRow(array $row): array
{
    return [
        'id' => (string)$row['id'],
        'key' => (string)$row['section_key'],
        'title' => (string)$row['title'],
        'body' => (string)($row['body_text'] ?? ''),
        'updatedAt' => (string)$row['updated_at'],
    ];
}

function servicePageFromRow(array $row, array $images): array
{
    return [
        'id' => (string)$row['id'],
        'slug' => (string)$row['slug'],
        'title' => (string)$row['title'],
        'summary' => (string)$row['summary'],
        'heroImageUrl' => (string)$row['hero_image_url'],
        'images' => $images,
        'updatedAt' => (string)$row['updated_at'],
    ];
}

function serviceImageFromRow(array $row): array
{
    return [
        'id' => (string)$row['id'],
        'imageUrl' => (string)$row['image_url'],
        'altText' => (string)$row['alt_text'],
        'caption' => (string)$row['caption'],
        'sortOrder' => (int)$row['sort_order'],
    ];
}

function socialReelFromRow(array $row): array
{
    return [
        'id' => (string)$row['id'],
        'title' => (string)$row['title'],
        'href' => (string)$row['href'],
        'sortOrder' => (int)$row['sort_order'],
        'isPublished' => (bool)$row['is_published'],
        'createdAt' => (string)$row['created_at'],
        'updatedAt' => (string)$row['updated_at'],
    ];
}

function galleryImageFromRow(array $row): array
{
    return [
        'id' => (string)$row['id'],
        'title' => (string)$row['title'],
        'location' => (string)($row['location'] ?? ''),
        'imageUrl' => (string)$row['image_url'],
        'altText' => (string)($row['alt_text'] ?? ''),
        'sortOrder' => (int)$row['sort_order'],
        'isFeatured' => (bool)$row['is_featured'],
        'isHero' => (bool)$row['is_hero'],
        'isPublished' => (bool)$row['is_published'],
        'createdAt' => (string)$row['created_at'],
        'updatedAt' => (string)$row['updated_at'],
    ];
}

function testimonialFromRow(array $row): array
{
    return [
        'id' => (string)$row['id'],
        'quote' => (string)$row['quote_text'],
        'clientName' => (string)$row['client_name'],
        'rating' => (int)$row['rating'],
        'sortOrder' => (int)$row['sort_order'],
        'isPublished' => (bool)$row['is_published'],
        'createdAt' => (string)$row['created_at'],
        'updatedAt' => (string)$row['updated_at'],
    ];
}

function uploadErrorMessage(int $error): string
{
    return match ($error) {
        UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'Uploaded image exceeded the server upload limit before it could be optimized.',
        UPLOAD_ERR_PARTIAL => 'Image upload was interrupted. Please try again.',
        UPLOAD_ERR_NO_FILE => 'Choose an image to upload.',
        default => 'Image upload failed.',
    };
}

function uploadSafeSegment(string $value): string
{
    $segment = strtolower(trim((string)preg_replace('/[^a-z0-9]+/i', '-', $value), '-'));
    return $segment !== '' ? $segment : 'image';
}

function uploadedImageResource(string $path, string $mimeType)
{
    if (!extension_loaded('gd')) {
        throw new RuntimeException('Image optimizer is unavailable on this server.');
    }

    $image = match ($mimeType) {
        'image/jpeg' => function_exists('imagecreatefromjpeg') ? @imagecreatefromjpeg($path) : false,
        'image/png' => function_exists('imagecreatefrompng') ? @imagecreatefrompng($path) : false,
        'image/webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($path) : false,
        default => false,
    };

    if (!$image) {
        throw new RuntimeException('Uploaded image could not be opened for optimization.');
    }

    return $image;
}

function createOptimizedUpload(string $sourcePath, string $mimeType, string $targetPath): string
{
    $source = uploadedImageResource($sourcePath, $mimeType);
    $sourceWidth = imagesx($source);
    $sourceHeight = imagesy($source);

    if ($sourceWidth <= 0 || $sourceHeight <= 0) {
        imagedestroy($source);
        throw new RuntimeException('Uploaded image dimensions are invalid.');
    }

    $scale = min(1, OPTIMIZED_IMAGE_MAX_DIMENSION / max($sourceWidth, $sourceHeight));
    $targetWidth = max(1, (int)round($sourceWidth * $scale));
    $targetHeight = max(1, (int)round($sourceHeight * $scale));
    $canvas = imagecreatetruecolor($targetWidth, $targetHeight);

    if (!$canvas) {
        imagedestroy($source);
        throw new RuntimeException('Image optimizer could not prepare the image.');
    }

    $background = imagecolorallocate($canvas, 255, 255, 255);
    imagefilledrectangle($canvas, 0, 0, $targetWidth, $targetHeight, $background);
    imagecopyresampled(
        $canvas,
        $source,
        0,
        0,
        0,
        0,
        $targetWidth,
        $targetHeight,
        $sourceWidth,
        $sourceHeight
    );
    imageinterlace($canvas, true);

    $temporaryTarget = $targetPath . '.tmp-' . bin2hex(random_bytes(4));
    $quality = OPTIMIZED_IMAGE_START_QUALITY;

    while ($quality >= OPTIMIZED_IMAGE_MIN_QUALITY) {
        if (!imagejpeg($canvas, $temporaryTarget, $quality)) {
            imagedestroy($canvas);
            imagedestroy($source);
            @unlink($temporaryTarget);
            throw new RuntimeException('Optimized image could not be written.');
        }

        clearstatcache(true, $temporaryTarget);
        $optimizedSize = is_file($temporaryTarget) ? filesize($temporaryTarget) : 0;
        if ($optimizedSize > 0 && $optimizedSize <= OPTIMIZED_IMAGE_TARGET_BYTES) {
            break;
        }

        $quality -= 8;
    }

    imagedestroy($canvas);
    imagedestroy($source);

    if (!is_file($temporaryTarget) || filesize($temporaryTarget) <= 0) {
        @unlink($temporaryTarget);
        throw new RuntimeException('Optimized image is empty.');
    }

    return $temporaryTarget;
}

function moveOptimizedUpload(string $optimizedPath, string $targetPath): int
{
    if (is_file($targetPath)) {
        @unlink($targetPath);
    }

    if (!@rename($optimizedPath, $targetPath)) {
        @unlink($optimizedPath);
        throw new RuntimeException('Optimized image could not be saved.');
    }

    clearstatcache(true, $targetPath);
    return (int)filesize($targetPath);
}

function relativeImagePath(string $path): string
{
    $pathOnly = parse_url($path, PHP_URL_PATH);
    $relativePath = is_string($pathOnly) && $pathOnly !== '' ? $pathOnly : $path;

    return str_replace('\\', '/', ltrim($relativePath, '/'));
}

function deleteManagedServiceImage(string $siteRoot, string $path): void
{
    $relativePath = relativeImagePath($path);
    if (
        !str_starts_with($relativePath, 'images/services/') &&
        !str_starts_with($relativePath, 'uploads/services/')
    ) {
        return;
    }

    $rootPath = realpath($siteRoot);
    $targetPath = realpath($siteRoot . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relativePath));
    if (!$rootPath || !$targetPath || !str_starts_with($targetPath, $rootPath . DIRECTORY_SEPARATOR)) {
        return;
    }

    if (is_file($targetPath)) {
        @unlink($targetPath);
    }
}

function deleteManagedGalleryImage(string $siteRoot, string $path): void
{
    $relativePath = relativeImagePath($path);
    if (!str_starts_with($relativePath, 'uploads/gallery/')) {
        return;
    }

    $rootPath = realpath($siteRoot);
    $targetPath = realpath($siteRoot . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relativePath));
    if (!$rootPath || !$targetPath || !str_starts_with($targetPath, $rootPath . DIRECTORY_SEPARATOR)) {
        return;
    }

    if (is_file($targetPath)) {
        @unlink($targetPath);
    }
}

function deleteManagedContentImage(string $siteRoot, string $path): void
{
    $relativePath = relativeImagePath($path);
    if (!str_starts_with($relativePath, 'uploads/content/')) {
        return;
    }

    $rootPath = realpath($siteRoot);
    $targetPath = realpath($siteRoot . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relativePath));
    if (!$rootPath || !$targetPath || !str_starts_with($targetPath, $rootPath . DIRECTORY_SEPARATOR)) {
        return;
    }

    if (is_file($targetPath)) {
        @unlink($targetPath);
    }
}

function ensureDefaultContentSections(PDO $pdo): void
{
    $statement = $pdo->prepare(
        'INSERT IGNORE INTO content_sections (section_key, title, body_json, body_text)
         VALUES (:section_key, :title, :body_json, :body_text)'
    );
    $defaults = [
        [
            'homepage.hero',
            'Homepage Hero',
            json_encode([
                'headline' => 'Stone care and marble restoration',
                'subheadline' => 'Professional surface care for hotels, homes, and commercial spaces.',
            ]),
            'Stone care and marble restoration for hotels, homes, and commercial spaces.',
        ],
        [
            'homepage.hero.background',
            'Homepage Hero Background',
            json_encode(['imageUrl' => 'images/hero-marble-floor-stair.jpg']),
            'images/hero-marble-floor-stair.jpg',
        ],
        [
            'services.summary',
            'Services Summary',
            json_encode(['services' => ['Cleaning', 'Polishing', 'Sealing', 'Restoration']]),
            'Cleaning, polishing, sealing, restoration, and maintenance for marble, granite, terrazzo, and tile.',
        ],
        [
            'contact.quote',
            'Contact / Quote Info',
            json_encode(['phone' => '0917 824 1220', 'email' => 'contactus@technoshineph.com']),
            'For service quotes, call 0917 824 1220 or email contactus@technoshineph.com.',
        ],
    ];

    foreach ($defaults as [$sectionKey, $title, $bodyJson, $bodyText]) {
        $statement->execute([
            'section_key' => $sectionKey,
            'title' => $title,
            'body_json' => $bodyJson,
            'body_text' => $bodyText,
        ]);
    }
}

try {
    $pdo = db();
    ensureEmployeeOrgGroupColumn($pdo);
    migrateEmployeeHierarchy($pdo);
    ensureDefaultContentSections($pdo);
    ensureSocialReelsTable($pdo);
    ensureGalleryImagesTable($pdo);
    ensureVisitorSessionsTable($pdo);
    ensureTestimonialsTable($pdo);
    $action = (string)($_GET['action'] ?? '');
    $method = $_SERVER['REQUEST_METHOD'];

    if ($action === 'login' && $method === 'POST') {
        $payload = body();
        $email = strtolower(trim((string)($payload['email'] ?? '')));
        $password = (string)($payload['password'] ?? '');
        $remember = (bool)($payload['remember'] ?? false);

        $statement = $pdo->prepare('SELECT id, email, password_hash, role FROM users WHERE email = :email LIMIT 1');
        $statement->execute(['email' => $email]);
        $user = $statement->fetch();

        if (!$user || !password_verify($password, (string)$user['password_hash'])) {
            respond(401, ['ok' => false, 'message' => 'Invalid admin email or password.']);
        }

        $token = bin2hex(random_bytes(32));
        $expiryExpression = $remember
            ? 'DATE_ADD(UTC_TIMESTAMP(), INTERVAL 30 DAY)'
            : 'DATE_ADD(UTC_TIMESTAMP(), INTERVAL 8 HOUR)';

        $insert = $pdo->prepare(
            'INSERT INTO sessions (user_id, token_hash, remember_me, expires_at)
             VALUES (:user_id, :token_hash, :remember_me, ' . $expiryExpression . ')'
        );
        $insert->execute([
            'user_id' => $user['id'],
            'token_hash' => hash('sha256', $token),
            'remember_me' => $remember ? 1 : 0,
        ]);

        $sessionStatement = $pdo->prepare(
            'SELECT created_at, expires_at FROM sessions WHERE id = :id LIMIT 1'
        );
        $sessionStatement->execute(['id' => $pdo->lastInsertId()]);
        $session = $sessionStatement->fetch();
        if (!$session) {
            respond(500, ['ok' => false, 'message' => 'Session could not be created.']);
        }

        setSessionCookie($token, $remember);
        respond(200, [
            'ok' => true,
            'session' => [
                'email' => $user['email'],
                'role' => $user['role'],
                'remember' => $remember,
                'createdAt' => utcDateTime((string)$session['created_at']),
                'expiresAt' => utcDateTime((string)$session['expires_at']),
            ],
        ]);
    }

    if ($action === 'logout' && $method === 'POST') {
        $token = $_COOKIE[SESSION_COOKIE] ?? '';
        if (is_string($token) && $token !== '') {
            $delete = $pdo->prepare('DELETE FROM sessions WHERE token_hash = :token_hash');
            $delete->execute(['token_hash' => hash('sha256', $token)]);
        }

        clearSessionCookie();
        respond(200, ['ok' => true]);
    }

    if ($action === 'me' && $method === 'GET') {
        $user = currentUser($pdo);
        respond(200, [
            'ok' => true,
            'session' => $user ? [
                'email' => $user['email'],
                'role' => $user['role'],
                'remember' => (bool)$user['remember_me'],
                'createdAt' => utcDateTime((string)$user['created_at']),
                'expiresAt' => utcDateTime((string)$user['expires_at']),
            ] : null,
        ]);
    }

    if ($action === 'visitors.track' && $method === 'POST') {
        $payload = body();
        $visitorId = trim((string)($payload['visitorId'] ?? ''));
        if ($visitorId === '') {
            $visitorId = bin2hex(random_bytes(16));
        }

        $visitorId = substr((string)preg_replace('/[^a-zA-Z0-9_-]/', '', $visitorId), 0, 80);
        if ($visitorId === '') {
            $visitorId = bin2hex(random_bytes(16));
        }

        $path = trim((string)($payload['path'] ?? '/'));
        if ($path === '') {
            $path = '/';
        }
        $path = substr($path, 0, 500);
        $userAgent = (string)($_SERVER['HTTP_USER_AGENT'] ?? '');

        $pdo->exec("DELETE FROM visitor_sessions WHERE last_seen_at < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 1 DAY)");
        $statement = $pdo->prepare(
            'INSERT INTO visitor_sessions (visitor_id, last_path, user_agent_hash, last_seen_at)
             VALUES (:visitor_id, :last_path, :user_agent_hash, UTC_TIMESTAMP())
             ON DUPLICATE KEY UPDATE
              last_path = VALUES(last_path),
              user_agent_hash = VALUES(user_agent_hash),
              last_seen_at = UTC_TIMESTAMP()'
        );
        $statement->execute([
            'visitor_id' => $visitorId,
            'last_path' => $path,
            'user_agent_hash' => $userAgent !== '' ? hash('sha256', $userAgent) : null,
        ]);

        $activeVisitors = (int)$pdo->query(
            "SELECT COUNT(*) FROM visitor_sessions WHERE last_seen_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 2 MINUTE)"
        )->fetchColumn();

        respond(200, ['ok' => true, 'visitorId' => $visitorId, 'activeVisitors' => $activeVisitors]);
    }

    if ($action === 'products' && $method === 'GET') {
        $published = ($_GET['published'] ?? '') === 'true';
        $sql = 'SELECT * FROM products';
        if ($published) {
            $sql .= ' WHERE is_published = 1';
        }
        $sql .= ' ORDER BY updated_at DESC, id DESC';
        $rows = $pdo->query($sql)->fetchAll();
        respond(200, ['ok' => true, 'products' => array_map('productFromRow', $rows)]);
    }

    if ($action === 'products.save' && $method === 'POST') {
        requireUser($pdo);
        $product = body();
        $slug = trim((string)($product['slug'] ?? ''));
        if ($slug === '') {
            $slug = strtolower(trim(preg_replace('/[^a-z0-9]+/i', '-', (string)$product['name']), '-'));
        }

        $statement = $pdo->prepare(
            'INSERT INTO products
              (slug, name, brand, category, size, usage_short, use_for, price, stock, badge, image_url, shopee_url, description, how_to_use, visual, is_published)
             VALUES
              (:slug, :name, :brand, :category, :size, :usage_short, :use_for, :price, :stock, :badge, :image_url, :shopee_url, :description, :how_to_use, :visual, :is_published)
             ON DUPLICATE KEY UPDATE
              name = VALUES(name),
              brand = VALUES(brand),
              category = VALUES(category),
              size = VALUES(size),
              usage_short = VALUES(usage_short),
              price = VALUES(price),
              stock = VALUES(stock),
              badge = VALUES(badge),
              image_url = VALUES(image_url),
              shopee_url = VALUES(shopee_url),
              description = VALUES(description),
              is_published = VALUES(is_published),
              updated_at = CURRENT_TIMESTAMP'
        );
        $statement->execute([
            'slug' => $slug,
            'name' => trim((string)$product['name']),
            'brand' => trim((string)($product['brand'] ?? 'TECHNOSHINE')),
            'category' => (string)$product['category'],
            'size' => (string)($product['size'] ?? '500ml'),
            'usage_short' => (string)($product['usesLine'] ?? ''),
            'use_for' => json_encode($product['useFor'] ?? ['Floors', 'Countertops']),
            'price' => (float)($product['price'] ?? 0),
            'stock' => max(0, (int)($product['stockLeft'] ?? 0)),
            'badge' => ($product['badge'] ?? '') ?: null,
            'image_url' => ($product['imageUrl'] ?? '') ?: null,
            'shopee_url' => ($product['shopeeUrl'] ?? '') ?: null,
            'description' => ($product['description'] ?? '') ?: null,
            'how_to_use' => json_encode($product['howToUse'] ?? []),
            'visual' => json_encode($product['visual'] ?? ['accent' => '#FF6B00', 'surface' => '#FFF8F2', 'label' => $product['category'] ?? 'Product']),
            'is_published' => !empty($product['isPublished']) ? 1 : 0,
        ]);
        respond(200, ['ok' => true]);
    }

    if ($action === 'products.delete' && $method === 'POST') {
        requireUser($pdo);
        $payload = body();
        $statement = $pdo->prepare('DELETE FROM products WHERE id = :id');
        $statement->execute(['id' => (int)($payload['id'] ?? 0)]);
        respond(200, ['ok' => true]);
    }

    if ($action === 'employees' && $method === 'GET') {
        requireUser($pdo);
        $rows = $pdo->query(
            "SELECT * FROM employees
             ORDER BY FIELD(org_group, 'board', 'leadership', 'dept', 'staff'), department ASC, name ASC"
        )->fetchAll();
        respond(200, ['ok' => true, 'employees' => array_map('employeeFromRow', $rows)]);
    }

    if ($action === 'employees.public' && $method === 'GET') {
        $rows = $pdo->query(
            "SELECT * FROM employees
             WHERE status = 'active'
               AND deleted_at IS NULL
             ORDER BY FIELD(org_group, 'board', 'leadership', 'dept', 'staff'), department ASC, name ASC"
        )->fetchAll();
        respond(200, ['ok' => true, 'employees' => array_map('employeeFromRow', $rows)]);
    }

    if ($action === 'employees.save' && $method === 'POST') {
        requireUser($pdo);
        $employee = body();
        $orgGroup = (string)($employee['orgGroup'] ?? 'staff');
        if (!in_array($orgGroup, ['board', 'leadership', 'dept', 'staff'], true)) {
            $orgGroup = 'staff';
        }
        $deletedAt = ($employee['deletedAt'] ?? '') ?: null;
        $isPublished = array_key_exists('isPublished', $employee)
            ? !empty($employee['isPublished'])
            : $deletedAt === null;

        $statement = $pdo->prepare(
            'INSERT INTO employees
              (employee_id, name, position, department, org_group, reports_to_employee_id, photo_url, status, deleted_at)
             VALUES
              (:employee_id, :name, :position, :department, :org_group, :reports_to_employee_id, :photo_url, :status, :deleted_at)
             ON DUPLICATE KEY UPDATE
              name = VALUES(name),
              position = VALUES(position),
              department = VALUES(department),
              org_group = VALUES(org_group),
              reports_to_employee_id = VALUES(reports_to_employee_id),
              photo_url = VALUES(photo_url),
              status = VALUES(status),
              deleted_at = VALUES(deleted_at),
              updated_at = CURRENT_TIMESTAMP'
        );
        $statement->execute([
            'employee_id' => trim((string)$employee['employeeId']),
            'name' => trim((string)$employee['name']),
            'position' => trim((string)$employee['position']),
            'department' => trim((string)$employee['department']),
            'org_group' => $orgGroup,
            'reports_to_employee_id' => ($employee['reportsTo'] ?? '') ?: null,
            'photo_url' => ($employee['photoUrl'] ?? '') ?: null,
            'status' => $deletedAt === null && $isPublished ? 'active' : 'inactive',
            'deleted_at' => $deletedAt,
        ]);
        respond(200, ['ok' => true]);
    }

    if ($action === 'employees.delete' && $method === 'POST') {
        requireUser($pdo);
        $payload = body();
        $statement = $pdo->prepare(
            'UPDATE employees
             SET status = "inactive", deleted_at = NOW()
             WHERE id = :id OR employee_id = :employee_id'
        );
        $statement->execute([
            'id' => (int)($payload['id'] ?? 0),
            'employee_id' => trim((string)($payload['employeeId'] ?? '')),
        ]);
        respond(200, ['ok' => true]);
    }

    if (($action === 'content.public' || $action === 'content') && $method === 'GET') {
        if ($action === 'content') {
            requireUser($pdo);
        }
        $rows = $pdo->query('SELECT * FROM content_sections ORDER BY section_key ASC')->fetchAll();
        respond(200, ['ok' => true, 'sections' => array_map('contentFromRow', $rows)]);
    }

    if ($action === 'content.save' && $method === 'POST') {
        requireUser($pdo);
        $payload = body();
        $sections = is_array($payload['sections'] ?? null) ? $payload['sections'] : [];
        $statement = $pdo->prepare(
            'INSERT INTO content_sections (section_key, title, body_text, body_json)
             VALUES (:section_key, :title, :body_text, :body_json)
             ON DUPLICATE KEY UPDATE
              title = VALUES(title),
              body_text = VALUES(body_text),
              body_json = VALUES(body_json),
              updated_at = CURRENT_TIMESTAMP'
        );

        foreach ($sections as $section) {
            $statement->execute([
                'section_key' => (string)$section['key'],
                'title' => (string)$section['title'],
                'body_text' => (string)$section['body'],
                'body_json' => json_encode(['body' => (string)$section['body']]),
            ]);
        }
        respond(200, ['ok' => true]);
    }

    if ($action === 'content.upload-image' && $method === 'POST') {
        requireUser($pdo);

        $file = $_FILES['image'] ?? null;
        if (!is_array($file)) {
            respond(400, ['ok' => false, 'message' => 'Choose an image to upload.']);
        }

        $uploadError = (int)($file['error'] ?? UPLOAD_ERR_NO_FILE);
        if ($uploadError !== UPLOAD_ERR_OK) {
            respond(400, ['ok' => false, 'message' => uploadErrorMessage($uploadError)]);
        }

        $fileSize = (int)($file['size'] ?? 0);
        if ($fileSize <= 0) {
            respond(400, ['ok' => false, 'message' => 'Uploaded image is empty.']);
        }
        if ($fileSize > MAX_IMAGE_UPLOAD_BYTES) {
            respond(413, ['ok' => false, 'message' => 'Uploaded image must be 50MB or smaller before optimization.']);
        }

        $temporaryPath = (string)($file['tmp_name'] ?? '');
        if ($temporaryPath === '' || !is_uploaded_file($temporaryPath)) {
            respond(400, ['ok' => false, 'message' => 'Uploaded image could not be verified.']);
        }

        $mimeType = (new finfo(FILEINFO_MIME_TYPE))->file($temporaryPath) ?: '';
        $allowedTypes = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
        ];

        if (!isset($allowedTypes[$mimeType])) {
            respond(415, ['ok' => false, 'message' => 'Only JPG, PNG, and WEBP images are allowed.']);
        }

        $contentKey = uploadSafeSegment((string)($_POST['contentKey'] ?? 'content'));
        $fileBaseName = $contentKey . '-' . date('YmdHis') . '-' . bin2hex(random_bytes(3));
        $fileName = $fileBaseName . '.jpg';
        $siteRoot = dirname(__DIR__);
        $uploadDirectory = $siteRoot . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'content';

        if (!is_dir($uploadDirectory) && !mkdir($uploadDirectory, 0755, true) && !is_dir($uploadDirectory)) {
            respond(500, ['ok' => false, 'message' => 'Upload directory could not be created.']);
        }

        $targetPath = $uploadDirectory . DIRECTORY_SEPARATOR . $fileName;
        try {
            $optimizedPath = createOptimizedUpload($temporaryPath, $mimeType, $targetPath);
            $optimizedSize = moveOptimizedUpload($optimizedPath, $targetPath);
        } catch (Throwable $error) {
            respond(500, ['ok' => false, 'message' => $error->getMessage()]);
        }

        respond(200, [
            'ok' => true,
            'url' => 'uploads/content/' . $fileName,
            'optimizedBytes' => $optimizedSize,
        ]);
    }

    if ($action === 'reels' && $method === 'GET') {
        requireUser($pdo);
        $rows = $pdo->query(
            'SELECT * FROM social_reels
             ORDER BY sort_order ASC, updated_at DESC, id ASC'
        )->fetchAll();
        respond(200, ['ok' => true, 'reels' => array_map('socialReelFromRow', $rows)]);
    }

    if ($action === 'reels.public' && $method === 'GET') {
        $rows = $pdo->query(
            'SELECT * FROM social_reels
             WHERE is_published = 1
             ORDER BY sort_order ASC, updated_at DESC, id ASC'
        )->fetchAll();
        respond(200, ['ok' => true, 'reels' => array_map('socialReelFromRow', $rows)]);
    }

    if ($action === 'reels.save' && $method === 'POST') {
        requireUser($pdo);
        $payload = body();
        $reels = is_array($payload['reels'] ?? null) ? $payload['reels'] : [];

        $statement = $pdo->prepare(
            'INSERT INTO social_reels (id, title, href, sort_order, is_published)
             VALUES (:id, :title, :href, :sort_order, :is_published)'
        );

        $pdo->beginTransaction();
        $pdo->exec('DELETE FROM social_reels');

        $sortOrder = 1;
        foreach ($reels as $reel) {
            $id = trim((string)($reel['id'] ?? ''));
            $title = trim((string)($reel['title'] ?? ''));
            $href = trim((string)($reel['href'] ?? ''));

            if ($id === '' || $title === '' || $href === '') {
                continue;
            }

            $statement->execute([
                'id' => $id,
                'title' => $title,
                'href' => $href,
                'sort_order' => max(1, (int)($reel['sortOrder'] ?? $sortOrder)),
                'is_published' => !empty($reel['isPublished']) ? 1 : 0,
            ]);
            $sortOrder++;
        }

        $pdo->commit();
        respond(200, ['ok' => true]);
    }

    if ($action === 'testimonials' && $method === 'GET') {
        requireUser($pdo);
        $rows = $pdo->query(
            'SELECT * FROM testimonials
             ORDER BY sort_order ASC, updated_at DESC, id ASC'
        )->fetchAll();
        respond(200, ['ok' => true, 'testimonials' => array_map('testimonialFromRow', $rows)]);
    }

    if ($action === 'testimonials.public' && $method === 'GET') {
        $rows = $pdo->query(
            'SELECT * FROM testimonials
             WHERE is_published = 1
             ORDER BY sort_order ASC, updated_at DESC, id ASC'
        )->fetchAll();
        respond(200, ['ok' => true, 'testimonials' => array_map('testimonialFromRow', $rows)]);
    }

    if ($action === 'testimonials.save' && $method === 'POST') {
        requireUser($pdo);
        $testimonial = body();
        $id = uploadSafeSegment((string)($testimonial['id'] ?? ''));
        $quote = trim((string)($testimonial['quote'] ?? ''));
        $clientName = trim((string)($testimonial['clientName'] ?? ''));
        $rating = min(5, max(1, (int)($testimonial['rating'] ?? 5)));

        if ($id === '' || $quote === '' || $clientName === '') {
            respond(400, ['ok' => false, 'message' => 'Testimonial needs an ID, quote, and client name.']);
        }

        $statement = $pdo->prepare(
            'INSERT INTO testimonials (id, quote_text, client_name, rating, sort_order, is_published)
             VALUES (:id, :quote_text, :client_name, :rating, :sort_order, :is_published)
             ON DUPLICATE KEY UPDATE
              quote_text = VALUES(quote_text),
              client_name = VALUES(client_name),
              rating = VALUES(rating),
              sort_order = VALUES(sort_order),
              is_published = VALUES(is_published),
              updated_at = CURRENT_TIMESTAMP'
        );
        $statement->execute([
            'id' => $id,
            'quote_text' => $quote,
            'client_name' => $clientName,
            'rating' => $rating,
            'sort_order' => max(1, (int)($testimonial['sortOrder'] ?? 1)),
            'is_published' => !empty($testimonial['isPublished']) ? 1 : 0,
        ]);

        respond(200, ['ok' => true]);
    }

    if ($action === 'testimonials.delete' && $method === 'POST') {
        requireUser($pdo);
        $payload = body();
        $id = trim((string)($payload['id'] ?? ''));
        if ($id === '') {
            respond(400, ['ok' => false, 'message' => 'Testimonial ID is required.']);
        }

        $statement = $pdo->prepare('DELETE FROM testimonials WHERE id = :id');
        $statement->execute(['id' => $id]);
        respond(200, ['ok' => true]);
    }

    if ($action === 'gallery' && $method === 'GET') {
        requireUser($pdo);
        $rows = $pdo->query(
            'SELECT * FROM gallery_images
             ORDER BY sort_order ASC, updated_at DESC, id ASC'
        )->fetchAll();
        respond(200, ['ok' => true, 'images' => array_map('galleryImageFromRow', $rows)]);
    }

    if ($action === 'gallery.public' && $method === 'GET') {
        $rows = $pdo->query(
            'SELECT * FROM gallery_images
             WHERE is_published = 1
             ORDER BY sort_order ASC, updated_at DESC, id ASC'
        )->fetchAll();
        respond(200, ['ok' => true, 'images' => array_map('galleryImageFromRow', $rows)]);
    }

    if ($action === 'gallery.save' && $method === 'POST') {
        requireUser($pdo);
        $image = body();
        $id = uploadSafeSegment((string)($image['id'] ?? ''));
        $title = trim((string)($image['title'] ?? ''));
        $imageUrl = trim((string)($image['imageUrl'] ?? ''));

        if ($id === '' || $title === '' || $imageUrl === '') {
            respond(400, ['ok' => false, 'message' => 'Gallery image needs an ID, title, and image file.']);
        }

        $statement = $pdo->prepare(
            'INSERT INTO gallery_images
              (id, title, location, image_url, alt_text, sort_order, is_featured, is_hero, is_published)
             VALUES
              (:id, :title, :location, :image_url, :alt_text, :sort_order, :is_featured, :is_hero, :is_published)
             ON DUPLICATE KEY UPDATE
              title = VALUES(title),
              location = VALUES(location),
              image_url = VALUES(image_url),
              alt_text = VALUES(alt_text),
              sort_order = VALUES(sort_order),
              is_featured = VALUES(is_featured),
              is_hero = VALUES(is_hero),
              is_published = VALUES(is_published),
              updated_at = CURRENT_TIMESTAMP'
        );
        $statement->execute([
            'id' => $id,
            'title' => $title,
            'location' => trim((string)($image['location'] ?? '')),
            'image_url' => $imageUrl,
            'alt_text' => trim((string)($image['altText'] ?? $title)),
            'sort_order' => max(1, (int)($image['sortOrder'] ?? 1)),
            'is_featured' => !empty($image['isFeatured']) ? 1 : 0,
            'is_hero' => !empty($image['isHero']) ? 1 : 0,
            'is_published' => !empty($image['isPublished']) ? 1 : 0,
        ]);
        respond(200, ['ok' => true]);
    }

    if ($action === 'gallery.delete' && $method === 'POST') {
        requireUser($pdo);
        $payload = body();
        $id = trim((string)($payload['id'] ?? ''));
        if ($id === '') {
            respond(400, ['ok' => false, 'message' => 'Gallery image ID is required.']);
        }

        $select = $pdo->prepare('SELECT image_url FROM gallery_images WHERE id = :id LIMIT 1');
        $select->execute(['id' => $id]);
        $imageUrl = $select->fetchColumn();

        $statement = $pdo->prepare('DELETE FROM gallery_images WHERE id = :id');
        $statement->execute(['id' => $id]);

        if (is_string($imageUrl) && $imageUrl !== '') {
            deleteManagedGalleryImage(dirname(__DIR__), $imageUrl);
        }

        respond(200, ['ok' => true]);
    }

    if ($action === 'gallery.upload-image' && $method === 'POST') {
        requireUser($pdo);

        $file = $_FILES['image'] ?? null;
        if (!is_array($file)) {
            respond(400, ['ok' => false, 'message' => 'Choose an image to upload.']);
        }

        $uploadError = (int)($file['error'] ?? UPLOAD_ERR_NO_FILE);
        if ($uploadError !== UPLOAD_ERR_OK) {
            respond(400, ['ok' => false, 'message' => uploadErrorMessage($uploadError)]);
        }

        $fileSize = (int)($file['size'] ?? 0);
        if ($fileSize <= 0) {
            respond(400, ['ok' => false, 'message' => 'Uploaded image is empty.']);
        }
        if ($fileSize > MAX_IMAGE_UPLOAD_BYTES) {
            respond(413, ['ok' => false, 'message' => 'Uploaded image must be 50MB or smaller before optimization.']);
        }

        $temporaryPath = (string)($file['tmp_name'] ?? '');
        if ($temporaryPath === '' || !is_uploaded_file($temporaryPath)) {
            respond(400, ['ok' => false, 'message' => 'Uploaded image could not be verified.']);
        }

        $mimeType = (new finfo(FILEINFO_MIME_TYPE))->file($temporaryPath) ?: '';
        $allowedTypes = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
        ];

        if (!isset($allowedTypes[$mimeType])) {
            respond(415, ['ok' => false, 'message' => 'Only JPG, PNG, and WEBP images are allowed.']);
        }

        $galleryId = uploadSafeSegment((string)($_POST['galleryId'] ?? 'gallery'));
        $fileBaseName = $galleryId . '-' . date('YmdHis') . '-' . bin2hex(random_bytes(3));
        $fileName = $fileBaseName . '.jpg';
        $siteRoot = dirname(__DIR__);
        $uploadDirectory = $siteRoot . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'gallery';

        if (!is_dir($uploadDirectory) && !mkdir($uploadDirectory, 0755, true) && !is_dir($uploadDirectory)) {
            respond(500, ['ok' => false, 'message' => 'Upload directory could not be created.']);
        }

        $targetPath = $uploadDirectory . DIRECTORY_SEPARATOR . $fileName;
        try {
            $optimizedPath = createOptimizedUpload($temporaryPath, $mimeType, $targetPath);
            $optimizedSize = moveOptimizedUpload($optimizedPath, $targetPath);
            deleteManagedGalleryImage($siteRoot, (string)($_POST['previousImageUrl'] ?? ''));
        } catch (Throwable $error) {
            respond(500, ['ok' => false, 'message' => $error->getMessage()]);
        }

        respond(200, [
            'ok' => true,
            'url' => 'uploads/gallery/' . $fileName,
            'optimizedBytes' => $optimizedSize,
        ]);
    }

    if ($action === 'services' && $method === 'GET') {
        $pages = $pdo->query(
            "SELECT * FROM service_pages
             ORDER BY FIELD(slug, 'tiles', 'marble-polishing', 'crack-chip-repair', 'stone-restoration', 'sealing-protection', 'granite-care', 'terrazzo-polishing'), title ASC"
        )->fetchAll();
        $imageRows = $pdo->query(
            'SELECT * FROM service_images ORDER BY service_slug ASC, sort_order ASC, id ASC'
        )->fetchAll();
        $imagesByService = [];

        foreach ($imageRows as $imageRow) {
            $serviceSlug = (string)$imageRow['service_slug'];
            if (!isset($imagesByService[$serviceSlug])) {
                $imagesByService[$serviceSlug] = [];
            }
            $imagesByService[$serviceSlug][] = serviceImageFromRow($imageRow);
        }

        $services = array_map(
            fn(array $page) => servicePageFromRow($page, $imagesByService[(string)$page['slug']] ?? []),
            $pages
        );

        respond(200, ['ok' => true, 'services' => $services]);
    }

    if ($action === 'services.save' && $method === 'POST') {
        requireUser($pdo);
        $payload = body();
        $services = is_array($payload['services'] ?? null) ? $payload['services'] : [];

        $pageStatement = $pdo->prepare(
            'INSERT INTO service_pages (slug, title, summary, hero_image_url)
             VALUES (:slug, :title, :summary, :hero_image_url)
             ON DUPLICATE KEY UPDATE
              title = VALUES(title),
              summary = VALUES(summary),
              hero_image_url = VALUES(hero_image_url),
              updated_at = CURRENT_TIMESTAMP'
        );
        $deleteImagesStatement = $pdo->prepare('DELETE FROM service_images WHERE service_slug = :service_slug');
        $imageStatement = $pdo->prepare(
            'INSERT INTO service_images (service_slug, image_url, alt_text, caption, sort_order)
             VALUES (:service_slug, :image_url, :alt_text, :caption, :sort_order)'
        );

        $pdo->beginTransaction();
        foreach ($services as $service) {
            $slug = trim((string)($service['slug'] ?? ''));
            if ($slug === '') {
                continue;
            }

            $pageStatement->execute([
                'slug' => $slug,
                'title' => trim((string)($service['title'] ?? '')),
                'summary' => trim((string)($service['summary'] ?? '')),
                'hero_image_url' => trim((string)($service['heroImageUrl'] ?? '')),
            ]);

            $deleteImagesStatement->execute(['service_slug' => $slug]);
            $images = is_array($service['images'] ?? null) ? $service['images'] : [];
            $sortOrder = 1;

            foreach ($images as $image) {
                $imageUrl = trim((string)($image['imageUrl'] ?? ''));
                if ($imageUrl === '') {
                    continue;
                }

                $imageStatement->execute([
                    'service_slug' => $slug,
                    'image_url' => $imageUrl,
                    'alt_text' => trim((string)($image['altText'] ?? '')),
                    'caption' => trim((string)($image['caption'] ?? '')),
                    'sort_order' => $sortOrder,
                ]);
                $sortOrder++;
            }
        }
        $pdo->commit();

        respond(200, ['ok' => true]);
    }

    if ($action === 'services.upload-image' && $method === 'POST') {
        requireUser($pdo);

        $file = $_FILES['image'] ?? null;
        if (!is_array($file)) {
            respond(400, ['ok' => false, 'message' => 'Choose an image to upload.']);
        }

        $uploadError = (int)($file['error'] ?? UPLOAD_ERR_NO_FILE);
        if ($uploadError !== UPLOAD_ERR_OK) {
            respond(400, ['ok' => false, 'message' => uploadErrorMessage($uploadError)]);
        }

        $fileSize = (int)($file['size'] ?? 0);
        if ($fileSize <= 0) {
            respond(400, ['ok' => false, 'message' => 'Uploaded image is empty.']);
        }
        if ($fileSize > MAX_IMAGE_UPLOAD_BYTES) {
            respond(413, ['ok' => false, 'message' => 'Uploaded image must be 50MB or smaller before optimization.']);
        }

        $temporaryPath = (string)($file['tmp_name'] ?? '');
        if ($temporaryPath === '' || !is_uploaded_file($temporaryPath)) {
            respond(400, ['ok' => false, 'message' => 'Uploaded image could not be verified.']);
        }

        $mimeType = (new finfo(FILEINFO_MIME_TYPE))->file($temporaryPath) ?: '';
        $allowedTypes = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
        ];

        if (!isset($allowedTypes[$mimeType])) {
            respond(415, ['ok' => false, 'message' => 'Only JPG, PNG, and WEBP images are allowed.']);
        }

        $serviceSlug = uploadSafeSegment((string)($_POST['serviceSlug'] ?? 'service'));
        $slot = uploadSafeSegment((string)($_POST['slot'] ?? 'image'));
        $fileBaseName = $serviceSlug . '-' . $slot;
        $fileName = $fileBaseName . '.jpg';
        $siteRoot = dirname(__DIR__);
        $uploadDirectory = $siteRoot . DIRECTORY_SEPARATOR . 'images' . DIRECTORY_SEPARATOR . 'services';

        if (!is_dir($uploadDirectory) && !mkdir($uploadDirectory, 0755, true) && !is_dir($uploadDirectory)) {
            respond(500, ['ok' => false, 'message' => 'Upload directory could not be created.']);
        }

        $targetPath = $uploadDirectory . DIRECTORY_SEPARATOR . $fileName;
        try {
            $optimizedPath = createOptimizedUpload($temporaryPath, $mimeType, $targetPath);
        } catch (Throwable $error) {
            respond(500, ['ok' => false, 'message' => $error->getMessage()]);
        }

        deleteManagedServiceImage($siteRoot, (string)($_POST['previousImageUrl'] ?? ''));
        foreach (glob($uploadDirectory . DIRECTORY_SEPARATOR . $fileBaseName . '.*') ?: [] as $existingPath) {
            if (is_file($existingPath)) {
                @unlink($existingPath);
            }
        }

        try {
            $optimizedSize = moveOptimizedUpload($optimizedPath, $targetPath);
        } catch (Throwable $error) {
            respond(500, ['ok' => false, 'message' => $error->getMessage()]);
        }

        respond(200, [
            'ok' => true,
            'url' => 'images/services/' . $fileName . '?v=' . date('YmdHis') . bin2hex(random_bytes(2)),
            'optimizedBytes' => $optimizedSize,
        ]);
    }

    if ($action === 'counts' && $method === 'GET') {
        requireUser($pdo);
        $productCounts = $pdo->query(
            'SELECT COUNT(*) AS total,
                    COALESCE(SUM(CASE WHEN is_published = 1 THEN 1 ELSE 0 END), 0) AS published
             FROM products'
        )->fetch();
        $counts = [
            'employees' => (int)$pdo->query(
                "SELECT COUNT(*) FROM employees WHERE deleted_at IS NULL AND status = 'active'"
            )->fetchColumn(),
            'products' => (int)($productCounts['total'] ?? 0),
            'publishedProducts' => (int)($productCounts['published'] ?? 0),
            'contentSections' => (int)$pdo->query('SELECT COUNT(*) FROM content_sections')->fetchColumn(),
            'services' => (int)$pdo->query('SELECT COUNT(*) FROM service_pages')->fetchColumn(),
            'reels' => (int)$pdo->query('SELECT COUNT(*) FROM social_reels')->fetchColumn(),
            'galleryImages' => (int)$pdo->query('SELECT COUNT(*) FROM gallery_images')->fetchColumn(),
            'testimonials' => (int)$pdo->query('SELECT COUNT(*) FROM testimonials')->fetchColumn(),
            'liveVisitors' => (int)$pdo->query(
                "SELECT COUNT(*) FROM visitor_sessions WHERE last_seen_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 2 MINUTE)"
            )->fetchColumn(),
        ];
        respond(200, ['ok' => true, 'counts' => $counts]);
    }

    respond(404, ['ok' => false, 'message' => 'Endpoint not found.']);
} catch (Throwable $error) {
    respond(500, ['ok' => false, 'message' => $error->getMessage()]);
}
