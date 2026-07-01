<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

const RECIPIENT_EMAIL = 'jake.bartolay@technoshineph.com';
const FROM_EMAIL = 'contactus@technoshineph.com';
const FROM_NAME = 'Technoshine Website';

function respond(int $statusCode, bool $ok, string $message): void
{
    http_response_code($statusCode);
    echo json_encode([
        'ok' => $ok,
        'message' => $message,
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, false, 'Method not allowed.');
}

$rawBody = file_get_contents('php://input');
$payload = json_decode($rawBody ?: '', true);

if (!is_array($payload)) {
    respond(400, false, 'Invalid request body.');
}

$name = trim((string)($payload['name'] ?? ''));
$email = trim((string)($payload['email'] ?? ''));
$company = trim((string)($payload['company'] ?? ''));
$message = trim((string)($payload['message'] ?? ''));

if (strlen($name) < 2) {
    respond(422, false, 'Name is required.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, false, 'A valid email address is required.');
}

if (strlen($message) < 10) {
    respond(422, false, 'Message must be at least 10 characters.');
}

$cleanName = str_replace(["\r", "\n"], ' ', $name);
$cleanEmail = str_replace(["\r", "\n"], '', $email);
$subject = 'New Technoshine website inquiry';
$submittedAt = date('Y-m-d H:i:s T');
$pageUrl = $_SERVER['HTTP_REFERER'] ?? 'Not provided';

$bodyLines = [
    'New inquiry from the Technoshine website.',
    '',
    'Name: ' . $cleanName,
    'Email: ' . $cleanEmail,
    'Property / Company: ' . ($company !== '' ? $company : 'Not provided'),
    'Submitted: ' . $submittedAt,
    'Page: ' . $pageUrl,
    '',
    'Message:',
    $message,
];

$headers = [
    'From: ' . FROM_NAME . ' <' . FROM_EMAIL . '>',
    'Reply-To: ' . $cleanName . ' <' . $cleanEmail . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = mail(
    RECIPIENT_EMAIL,
    $subject,
    implode("\n", $bodyLines),
    implode("\r\n", $headers)
);

if (!$sent) {
    respond(500, false, 'Mail server failed to send the message.');
}

respond(200, true, 'Message sent.');
