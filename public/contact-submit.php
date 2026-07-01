<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

const RECIPIENT_EMAIL = 'jake.bartolay@technoshineph.com';
const FROM_EMAIL = 'contactus@technoshineph.com';
const FROM_NAME = 'Technoshine Website';
const INQUIRY_TYPE = 'Assessment Request';

function respond(int $statusCode, bool $ok, string $message): void
{
    http_response_code($statusCode);
    echo json_encode([
        'ok' => $ok,
        'message' => $message,
    ]);
    exit;
}

function escapeHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
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
$safeName = escapeHtml($cleanName);
$safeEmail = escapeHtml($cleanEmail);
$safeInquiryType = escapeHtml(INQUIRY_TYPE);
$safeCompany = escapeHtml($company !== '' ? $company : 'Not provided');
$safeMessage = nl2br(escapeHtml($message));
$submittedAt = (new DateTimeImmutable('now', new DateTimeZone('Asia/Manila')))
    ->format('F j, Y g:i A');
$safeSubmittedAt = escapeHtml($submittedAt);
$subject = 'New Inquiry Received - ' . $cleanName;

$htmlBody = <<<HTML
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Inquiry Received</title>
  </head>
  <body style="margin:0;background:#f4f0ea;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      <tr>
        <td align="center">
          <table role="presentation" width="680" cellspacing="0" cellpadding="0" style="width:680px;max-width:100%;border-collapse:collapse;border:2px solid #111111;background:#ffffff;box-shadow:8px 8px 0 rgba(0,0,0,0.18);">
            <tr>
              <td style="background:#101010;padding:28px 28px 24px 28px;">
                <div style="font-size:10px;line-height:1;letter-spacing:5px;color:#ff6b00;text-transform:uppercase;">Technoshine Website</div>
                <h1 style="margin:16px 0 10px 0;font-size:28px;line-height:1.15;color:#d7d7d7;font-weight:800;">New Inquiry Received</h1>
                <p style="margin:0;font-size:14px;line-height:1.6;color:#d0d0d0;">A new customer message has been submitted through the contact form.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #d9dee7;">
                  <tr>
                    <td width="50%" style="padding:18px;border-right:1px solid #d9dee7;border-bottom:1px solid #d9dee7;background:#fbfbfc;vertical-align:top;">
                      <div style="font-size:10px;letter-spacing:4px;color:#ff6b00;text-transform:uppercase;margin-bottom:12px;">Inquiry Type</div>
                      <div style="font-size:15px;font-weight:800;color:#111827;">{$safeInquiryType}</div>
                    </td>
                    <td width="50%" style="padding:18px;border-bottom:1px solid #d9dee7;background:#fbfbfc;vertical-align:top;">
                      <div style="font-size:10px;letter-spacing:4px;color:#ff6b00;text-transform:uppercase;margin-bottom:12px;">Submitted</div>
                      <div style="font-size:15px;font-weight:800;color:#111827;">{$safeSubmittedAt}</div>
                    </td>
                  </tr>
                  <tr>
                    <td width="50%" style="padding:18px;border-right:1px solid #d9dee7;border-bottom:1px solid #d9dee7;background:#fbfbfc;vertical-align:top;">
                      <div style="font-size:10px;letter-spacing:4px;color:#ff6b00;text-transform:uppercase;margin-bottom:12px;">Customer Name</div>
                      <div style="font-size:15px;font-weight:800;color:#111827;">{$safeName}</div>
                    </td>
                    <td width="50%" style="padding:18px;border-bottom:1px solid #d9dee7;background:#fbfbfc;vertical-align:top;">
                      <div style="font-size:10px;letter-spacing:4px;color:#ff6b00;text-transform:uppercase;margin-bottom:12px;">Email Address</div>
                      <a href="mailto:{$safeEmail}" style="font-size:15px;font-weight:800;color:#0068c9;text-decoration:underline;">{$safeEmail}</a>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding:18px;border-bottom:1px solid #d9dee7;background:#fbfbfc;vertical-align:top;">
                      <div style="font-size:10px;letter-spacing:4px;color:#ff6b00;text-transform:uppercase;margin-bottom:12px;">Property / Company</div>
                      <div style="font-size:15px;font-weight:800;color:#111827;">{$safeCompany}</div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding:18px;border-bottom:1px solid #d9dee7;background:#ffffff;vertical-align:top;">
                      <div style="font-size:10px;letter-spacing:4px;color:#ff6b00;text-transform:uppercase;">Customer Message</div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding:24px 20px 22px 20px;background:#ffffff;vertical-align:top;">
                      <div style="font-size:15px;line-height:1.65;color:#1f2937;">{$safeMessage}</div>
                    </td>
                  </tr>
                </table>
                <div style="background:#101010;color:#ffffff;padding:22px 20px;font-size:13px;line-height:1.6;">
                  Reply directly to this email to respond to <strong>{$safeName}</strong>.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
HTML;

$headers = [
    'From: ' . FROM_NAME . ' <' . FROM_EMAIL . '>',
    'Reply-To: ' . $cleanName . ' <' . $cleanEmail . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = mail(
    RECIPIENT_EMAIL,
    $subject,
    $htmlBody,
    implode("\r\n", $headers)
);

if (!$sent) {
    respond(500, false, 'Mail server failed to send the message.');
}

respond(200, true, 'Message sent.');
