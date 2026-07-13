CREATE DATABASE IF NOT EXISTS technoshine_data
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE technoshine_data;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor') NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  remember_me TINYINT(1) NOT NULL DEFAULT 0,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY sessions_token_hash_unique (token_hash),
  KEY sessions_user_id_index (user_id),
  CONSTRAINT sessions_user_id_foreign
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS employees (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  employee_id VARCHAR(30) NOT NULL,
  name VARCHAR(190) NOT NULL,
  position VARCHAR(190) NOT NULL,
  department VARCHAR(120) NOT NULL DEFAULT '',
  org_group ENUM('board', 'leadership', 'dept', 'staff') NOT NULL DEFAULT 'staff',
  reports_to_employee_id VARCHAR(30) NULL,
  address TEXT NULL,
  emergency_contact_name VARCHAR(190) NULL,
  emergency_contact_number VARCHAR(50) NULL,
  photo_url VARCHAR(500) NULL,
  signature_url VARCHAR(500) NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  deleted_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY employees_employee_id_unique (employee_id),
  KEY employees_department_index (department),
  KEY employees_reports_to_employee_id_index (reports_to_employee_id),
  CONSTRAINT employees_reports_to_employee_id_foreign
    FOREIGN KEY (reports_to_employee_id) REFERENCES employees(employee_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS content_sections (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  section_key VARCHAR(120) NOT NULL,
  title VARCHAR(190) NOT NULL,
  body_json JSON NULL,
  body_text MEDIUMTEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY content_sections_section_key_unique (section_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(190) NOT NULL,
  name VARCHAR(190) NOT NULL,
  brand VARCHAR(120) NOT NULL DEFAULT 'TECHNOSHINE',
  category ENUM('Cleaners', 'Polishes', 'Sealers', 'Stain Care', 'Professional Care') NOT NULL,
  size VARCHAR(30) NOT NULL DEFAULT '500ml',
  usage_short VARCHAR(255) NOT NULL DEFAULT '',
  use_for JSON NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  badge VARCHAR(50) NULL,
  image_url VARCHAR(500) NULL,
  shopee_url VARCHAR(500) NULL,
  description TEXT NULL,
  how_to_use JSON NULL,
  visual JSON NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY products_slug_unique (slug),
  KEY products_category_index (category),
  KEY products_is_published_index (is_published),
  KEY products_stock_index (stock)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS service_pages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(190) NOT NULL,
  title VARCHAR(190) NOT NULL,
  summary TEXT NOT NULL,
  hero_image_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY service_pages_slug_unique (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS service_images (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  service_slug VARCHAR(190) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255) NOT NULL DEFAULT '',
  caption VARCHAR(190) NOT NULL DEFAULT '',
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY service_images_service_slug_sort_order_unique (service_slug, sort_order),
  KEY service_images_service_slug_index (service_slug),
  CONSTRAINT service_images_service_slug_foreign
    FOREIGN KEY (service_slug) REFERENCES service_pages(slug)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS social_reels (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (email, password_hash, role)
VALUES
  ('admin@technoshineph.com', '$2y$10$N2MdrOgWsrOHtvhy57nDG.NwfKSq8A4SSNBMGyptPmUQgJBwYhhhq', 'admin')
ON DUPLICATE KEY UPDATE
  role = VALUES(role);

INSERT INTO employees (
  employee_id,
  name,
  position,
  department,
  org_group,
  reports_to_employee_id,
  address,
  emergency_contact_name,
  emergency_contact_number,
  photo_url,
  signature_url,
  status,
  deleted_at
)
VALUES
  ('ORG-MD-001', 'Erwin Torrefiel', 'Managing Director', 'Board / Ownership', 'board', NULL, NULL, NULL, NULL, 'team/MANAGING%20DIRECTOR.png', NULL, 'active', NULL),
  ('ORG-COO-001', 'Jo Torrefiel', 'COO', 'Board / Ownership', 'board', NULL, NULL, NULL, NULL, 'team/COO.jpg', NULL, 'active', NULL),
  ('ORG-PRES-001', 'Rich Nicollie Torrefiel', 'President', 'Leadership', 'leadership', 'ORG-MD-001', NULL, NULL, NULL, 'team/President.jpg', NULL, 'active', NULL),
  ('ORG-VP-001', 'Dexter Piolo Torrefiel', 'Vice President', 'Leadership', 'leadership', 'ORG-PRES-001', NULL, NULL, NULL, 'team/Vice%20President.jpg', NULL, 'active', NULL),
  ('MLR-001', 'Mary-Lou Robellon', 'Executive Manager', 'Leadership', 'leadership', 'ORG-VP-001', NULL, NULL, NULL, 'team/Executive%20Manager.jpg', NULL, 'active', NULL),
  ('ORG-TECH-001', 'Mark Antony Daga', 'Technical Manager', 'Technical', 'dept', 'MLR-001', NULL, NULL, NULL, 'team/Technical%20Manager.jpg', NULL, 'active', NULL),
  ('ORG-OPSMGR-001', 'Henry Cadorna', 'Operations Mgr', 'Technical', 'staff', 'ORG-TECH-001', NULL, NULL, NULL, 'team/Operations%20Mgr.jpg', NULL, 'active', NULL),
  ('ORG-OPSMGR-002', 'Renato Aducal', 'Operations Mgr', 'Technical', 'staff', 'ORG-TECH-001', NULL, NULL, NULL, 'team/Operations%20Mgr%202.jpg', NULL, 'active', NULL),
  ('23-003', 'Romalyn Tabuzo', 'Accounting Supervisor', 'Finance', 'dept', 'MLR-001', 'block 20 lot 15d concordia village san jose del monte bulacan', 'liza tabuzo', '09167141508', 'employees/photos/23-003.jpg', '23-003', 'active', NULL),
  ('24-015', 'MONICA MANGILIT', 'Admin Staff', 'Admin', 'dept', 'MLR-001', 'Socorro, 141 C 15th Avenue, Cubao, Quezon City.', 'MOISES MANGILIT', '09053694079', 'employees/photos/24-015.png', '24-015', 'active', NULL),
  ('26-001', 'Nonito Regino Guiao Jr', 'Rider Liaison', 'Admin', 'staff', '24-015', 'Sitio mataas na kahoy brgy fvr norzagaray bulacan', 'Sandra Raymonde Guiao', '09654757509', 'employees/photos/26-001.jpg', '26-001', 'active', NULL),
  ('ORG-OFFICEAID-001', 'Winks Morales Balala', 'Office Aid', 'Admin', 'staff', '24-015', NULL, NULL, NULL, 'team/Office%20Aid.jpg', NULL, 'active', NULL),
  ('ORG-IT-001', 'Aljhan Linga', 'IT Supervisor', 'IT / Creative', 'dept', 'MLR-001', NULL, NULL, NULL, 'team/IT%20Supervisor.jpg', NULL, 'active', NULL),
  ('ORG-GRAPHIC-001', 'Darwin John Canda', 'Graphic Designer', 'IT / Creative', 'staff', 'ORG-IT-001', NULL, NULL, NULL, 'team/Graphic%20Designer.jpg', NULL, 'active', NULL),
  ('ORG-ITASSIST-001', 'Jake Bartolay', 'IT Assistant', 'IT / Creative', 'staff', 'ORG-GRAPHIC-001', NULL, NULL, NULL, 'team/IT%20Assistant.jpg', NULL, 'active', NULL),
  ('26-003', 'VINCENT BRYAN A. GALLARDO', 'Project Engineer', 'Technical', 'staff', 'ORG-TECH-001', 'PUROK 3, BUENAVISTA, BAYOMBONG, NUEVA VISCAYA', 'gieselle cabauatan', '09171852055', 'employees/photos/26-003.png', '26-003', 'inactive', NOW())
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  position = VALUES(position),
  department = VALUES(department),
  org_group = VALUES(org_group),
  reports_to_employee_id = VALUES(reports_to_employee_id),
  address = VALUES(address),
  emergency_contact_name = VALUES(emergency_contact_name),
  emergency_contact_number = VALUES(emergency_contact_number),
  photo_url = VALUES(photo_url),
  signature_url = VALUES(signature_url),
  status = VALUES(status),
  deleted_at = VALUES(deleted_at);

INSERT INTO content_sections (section_key, title, body_json, body_text)
VALUES
  ('homepage.hero', 'Homepage Hero', JSON_OBJECT('headline', 'Stone care and marble restoration', 'subheadline', 'Professional surface care for hotels, homes, and commercial spaces.'), 'Stone care and marble restoration for hotels, homes, and commercial spaces.'),
  ('services.summary', 'Services Summary', JSON_OBJECT('services', JSON_ARRAY('Cleaning', 'Polishing', 'Sealing', 'Restoration')), 'Cleaning, polishing, sealing, restoration, and maintenance for marble, granite, terrazzo, and tile.'),
  ('contact.quote', 'Contact / Quote Info', JSON_OBJECT('phone', '0917 824 1220', 'email', 'contactus@technoshineph.com'), 'For service quotes, call 0917 824 1220 or email contactus@technoshineph.com.')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  body_json = VALUES(body_json),
  body_text = VALUES(body_text);

INSERT INTO service_pages (slug, title, summary, hero_image_url)
VALUES
  ('tiles', 'Tiles Cleaning', 'Professional cleaning and stain treatment for ceramic, porcelain, and other tile surfaces.', 'images/client-images/gallery-12.jpg'),
  ('marble-polishing', 'Marble Polishing', 'Diamond-grade polishing that revives dull, scratched marble to a mirror-finish brilliance.', 'images/client-images/gallery-1.jpg'),
  ('crack-chip-repair', 'Crack & Chip Repair', 'Expert structural repair of cracks, chips, and fractures using color-matched stone epoxies.', 'images/client-images/gallery-9.jpg'),
  ('stone-restoration', 'Stone Restoration', 'Full-cycle restoration for marble, granite, travertine, limestone, terrazzo, and other natural stone surfaces.', 'images/client-images/gallery-3.jpg'),
  ('sealing-protection', 'Sealing & Protection', 'Premium penetrating sealers that guard against staining, etching, and moisture ingress.', 'images/client-images/gallery-12.jpg'),
  ('granite-care', 'Granite Care', 'Professional cleaning, refinishing, and protection for granite floors, counters, walls, and feature areas.', 'images/client-images/gallery-11.jpg'),
  ('terrazzo-polishing', 'Terrazzo Polishing', 'Restoration and shine recovery for terrazzo surfaces in residential, retail, hotel, and commercial spaces.', 'images/client-images/gallery-13.jpg')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  summary = VALUES(summary),
  hero_image_url = VALUES(hero_image_url);

INSERT INTO service_images (service_slug, image_url, alt_text, caption, sort_order)
VALUES
  ('tiles', 'images/client-images/gallery-12.jpg', 'Cleaned tile surface showcase', 'Cleaned tile surface', 1),
  ('tiles', 'images/client-images/gallery-10.jpg', 'Detailed tile cleaning showcase', 'Detailed tile cleaning', 2),
  ('tiles', 'images/before-after/after-5.jpg', 'Finished tile cleaning result', 'Finished tile cleaning result', 3),
  ('marble-polishing', 'images/client-images/gallery-1.jpg', 'Polished marble floor showcase', 'Polished marble floor', 1),
  ('marble-polishing', 'images/client-images/gallery-2.jpg', 'Restored marble hallway showcase', 'Restored marble hallway', 2),
  ('marble-polishing', 'images/client-images/gallery-3.jpg', 'Cleaned marble lobby showcase', 'Cleaned marble lobby', 3),
  ('marble-polishing', 'images/before-after/after-1.jpeg', 'Finished marble polishing result', 'Finished polish result', 4),
  ('crack-chip-repair', 'images/client-images/gallery-9.jpg', 'Stone repair detail showcase', 'Stone repair detail', 1),
  ('crack-chip-repair', 'images/client-images/gallery-10.jpg', 'Cleaned stone surface after repair', 'Cleaned repair area', 2),
  ('crack-chip-repair', 'images/before-after/after-2.jpg', 'Finished crack and chip repair result', 'Finished repair result', 3),
  ('stone-restoration', 'images/client-images/gallery-3.jpg', 'Restored natural stone floor showcase', 'Restored stone floor', 1),
  ('stone-restoration', 'images/client-images/gallery-12.jpg', 'Cleaned stone surface showcase', 'Cleaned stone surface', 2),
  ('stone-restoration', 'images/client-images/gallery-14.jpg', 'Refinished stone floor showcase', 'Refinished floor area', 3),
  ('sealing-protection', 'images/client-images/gallery-12.jpg', 'Protected polished floor showcase', 'Protected polished floor', 1),
  ('sealing-protection', 'images/client-images/gallery-15.jpg', 'Sealed stone surface showcase', 'Sealed stone surface', 2),
  ('sealing-protection', 'images/before-after/after-5.jpg', 'Finished sealing protection result', 'Finished sealing result', 3),
  ('granite-care', 'images/client-images/gallery-11.jpg', 'Cleaned granite surface showcase', 'Cleaned granite surface', 1),
  ('granite-care', 'images/client-images/gallery-10.jpg', 'Granite detail cleaning showcase', 'Granite detail cleaning', 2),
  ('granite-care', 'images/before-after/after-4.jpg', 'Finished granite care result', 'Finished granite result', 3),
  ('terrazzo-polishing', 'images/client-images/gallery-13.jpg', 'Polished terrazzo floor showcase', 'Polished terrazzo floor', 1),
  ('terrazzo-polishing', 'images/client-images/gallery-14.jpg', 'Cleaned terrazzo surface showcase', 'Cleaned terrazzo surface', 2),
  ('terrazzo-polishing', 'images/before-after/after-6.jpg', 'Finished terrazzo polishing result', 'Finished terrazzo result', 3)
ON DUPLICATE KEY UPDATE
  image_url = VALUES(image_url),
  alt_text = VALUES(alt_text),
  caption = VALUES(caption);

INSERT INTO social_reels (id, title, href, sort_order, is_published)
VALUES
  ('company-reel-01', 'Project Reel 01', 'https://www.facebook.com/reel/830650776652467', 1, 1),
  ('company-reel-02', 'Project Reel 02', 'https://www.facebook.com/reel/4472370363007058', 2, 1)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  href = VALUES(href),
  sort_order = VALUES(sort_order),
  is_published = VALUES(is_published);

INSERT INTO products (
  slug,
  name,
  brand,
  category,
  size,
  usage_short,
  use_for,
  price,
  stock,
  badge,
  image_url,
  shopee_url,
  description,
  how_to_use,
  visual,
  is_published
)
VALUES
  ('marble-cleaner-500ml', 'Marble Cleaner (pH Neutral) 500ml', 'TECHNOSHINE', 'Cleaners', '500ml', 'Daily cleaning for marble floors and countertops', JSON_ARRAY('Floors', 'Countertops'), 0.00, 18, 'Best Seller', NULL, 'https://shopee.ph/search?keyword=Technoshine%20Marble%20Cleaner%20pH%20Neutral%20500ml', 'A marble-safe daily cleaner made for routine upkeep without harsh residue or dulling.', JSON_ARRAY('Sweep or wipe loose dust from the surface.', 'Apply to a damp microfiber cloth or mop.', 'Clean the area evenly, then wipe dry with a clean cloth.'), JSON_OBJECT('accent', '#FF6B00', 'surface', '#FFF8F2', 'label', 'pH Neutral'), 1),
  ('marble-polish-high-gloss-500ml', 'Marble Polish (High Gloss) 500ml', 'TECHNOSHINE', 'Polishes', '500ml', 'Restores shine on dull marble surfaces', JSON_ARRAY('Floors', 'Countertops', 'Tables'), 0.00, 14, 'Best Seller', NULL, 'https://shopee.ph/search?keyword=Technoshine%20Marble%20Polish%20High%20Gloss%20500ml', 'A gloss-restoring polish for marble surfaces that need a cleaner, brighter finish.', JSON_ARRAY('Clean and dry the marble surface first.', 'Apply a small amount with a soft applicator pad.', 'Buff in overlapping circles until the gloss returns.'), JSON_OBJECT('accent', '#1F1A17', 'surface', '#FFF3E8', 'label', 'High Gloss'), 1),
  ('marble-sealer-penetrating-1l', 'Marble Sealer (Penetrating) 1L', 'TECHNOSHINE', 'Sealers', '1L', 'Stain and moisture protection for marble', JSON_ARRAY('Floors', 'Countertops', 'Bathroom', 'Tables'), 0.00, 9, 'New Arrival', NULL, 'https://shopee.ph/search?keyword=Technoshine%20Marble%20Sealer%20Penetrating%201L', 'A penetrating marble sealer for added resistance against stains, moisture, and everyday spills.', JSON_ARRAY('Start with a clean, fully dry surface.', 'Apply a thin, even coat using a clean applicator.', 'Allow absorption, remove excess, then let the sealer cure.'), JSON_OBJECT('accent', '#14B8A6', 'surface', '#FFF8F2', 'label', 'Sealer'), 1),
  ('marble-stain-remover-250ml', 'Marble Stain Remover 250ml', 'TECHNOSHINE', 'Stain Care', '250ml', 'Targets coffee, oil, and hard water stains', JSON_ARRAY('Countertops', 'Bathroom', 'Tables'), 0.00, 11, 'New Arrival', NULL, 'https://shopee.ph/search?keyword=Technoshine%20Marble%20Stain%20Remover%20250ml', 'A targeted stain remover for common marble marks such as coffee, oil, and hard water residue.', JSON_ARRAY('Test on a small hidden area before use.', 'Apply directly to the stained area.', 'Let it work briefly, then wipe and rinse with a damp cloth.'), JSON_OBJECT('accent', '#4F46E5', 'surface', '#FFF8F2', 'label', 'Stain Care'), 1),
  ('marble-crystallizer-1l', 'Marble Crystallizer 1L', 'TECHNOSHINE', 'Professional Care', '1L', 'Pro-grade floor crystallization for marble', JSON_ARRAY('Floors'), 0.00, 7, 'Pro Grade', NULL, 'https://shopee.ph/search?keyword=Technoshine%20Marble%20Crystallizer%201L', 'A professional-grade crystallizer for restoring dense, reflective marble floor finishes.', JSON_ARRAY('Clean, hone, and dry the floor before crystallization.', 'Mist a workable section with the product.', 'Buff using the correct machine pad until the desired finish appears.'), JSON_OBJECT('accent', '#D95B00', 'surface', '#FFF3E8', 'label', 'Pro Grade'), 1),
  ('marble-polishing-powder-1kg', 'Marble Polishing Powder 1kg', 'TECHNOSHINE', 'Professional Care', '1kg', 'For etching and light scratches on marble', JSON_ARRAY('Floors', 'Countertops', 'Tables'), 0.00, 10, 'Pro Grade', NULL, 'https://shopee.ph/search?keyword=Technoshine%20Marble%20Polishing%20Powder%201kg', 'A marble polishing powder for correcting light etching, haze, and fine scratches.', JSON_ARRAY('Clean the surface and mask adjacent materials.', 'Mix powder with water to form a polishing slurry.', 'Polish in sections, then rinse and dry thoroughly.'), JSON_OBJECT('accent', '#334155', 'surface', '#FFF8F2', 'label', 'Powder'), 1),
  ('daily-spray-cleaner-350ml', 'Daily Spray Cleaner 350ml', 'TECHNOSHINE', 'Cleaners', '350ml', 'Spray-and-wipe cleaner, marble safe', JSON_ARRAY('Countertops', 'Bathroom', 'Tables'), 0.00, 22, 'New Arrival', NULL, 'https://shopee.ph/search?keyword=Technoshine%20Daily%20Spray%20Cleaner%20350ml', 'A convenient spray-and-wipe cleaner for daily marble-safe touchups.', JSON_ARRAY('Spray lightly onto the surface or cloth.', 'Wipe evenly with a microfiber towel.', 'Dry the surface to prevent streaks or water marks.'), JSON_OBJECT('accent', '#0891B2', 'surface', '#FFF8F2', 'label', 'Daily Spray'), 1),
  ('stain-poultice-deep-stains-500g', 'Stain Poultice (Deep Stains) 500g', 'TECHNOSHINE', 'Stain Care', '500g', 'Deep-seated stain treatment for stone', JSON_ARRAY('Floors', 'Countertops', 'Bathroom', 'Tables'), 0.00, 6, 'Pro Grade', NULL, 'https://shopee.ph/search?keyword=Technoshine%20Stain%20Poultice%20Deep%20Stains%20500g', 'A poultice treatment for deep-seated stains that need longer contact time.', JSON_ARRAY('Clean the area and prepare the poultice paste.', 'Apply over the stain and cover as directed.', 'Allow proper dwell time, then remove, rinse, and dry.'), JSON_OBJECT('accent', '#64748B', 'surface', '#FFF3E8', 'label', 'Poultice'), 1)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  brand = VALUES(brand),
  category = VALUES(category),
  size = VALUES(size),
  usage_short = VALUES(usage_short),
  use_for = VALUES(use_for),
  price = VALUES(price),
  stock = VALUES(stock),
  badge = VALUES(badge),
  image_url = VALUES(image_url),
  shopee_url = VALUES(shopee_url),
  description = VALUES(description),
  how_to_use = VALUES(how_to_use),
  visual = VALUES(visual),
  is_published = VALUES(is_published);
