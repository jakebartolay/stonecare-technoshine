<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Method not allowed.']);
    exit;
}

$rawInput = file_get_contents('php://input');
$payload = json_decode($rawInput ?: '', true);

if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Invalid request body.']);
    exit;
}

$name = trim((string)($payload['name'] ?? ''));
$email = trim((string)($payload['email'] ?? ''));
$company = trim((string)($payload['company'] ?? ''));
$message = trim((string)($payload['message'] ?? ''));
$inquiryType = trim((string)($payload['inquiryType'] ?? 'assessment'));

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($message) < 10) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Please complete all required fields.']);
    exit;
}

/*
|--------------------------------------------------------------------------
| SMTP configuration
|--------------------------------------------------------------------------
| Prefer setting these as environment variables in cPanel when available.
| If env vars are not available in your hosting plan, replace the password
| placeholder below directly on the server after upload.
*/
$smtpHost = getenv('TECHNOSHINE_SMTP_HOST') ?: 'technoshineph.com';
$smtpPort = (int)(getenv('TECHNOSHINE_SMTP_PORT') ?: 465);
$smtpUser = getenv('TECHNOSHINE_SMTP_USER') ?: 'jake.bartolay@technoshineph.com';
$smtpPass = getenv('TECHNOSHINE_SMTP_PASS') ?: 'jake@t3chn0SH';
$toEmail = getenv('TECHNOSHINE_INBOX_TO') ?: 'jake.bartolay@technoshineph.com';
$fromEmail = getenv('TECHNOSHINE_INBOX_FROM') ?: 'jake.bartolay@technoshineph.com';
$fromName = getenv('TECHNOSHINE_INBOX_FROM_NAME') ?: 'Technoshine Website';

if ($smtpPass === '') {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Mail server is not configured yet.']);
    exit;
}

$safeName = preg_replace("/[\r\n]+/", ' ', $name) ?: $name;
$safeCompany = $company !== '' ? preg_replace("/[\r\n]+/", ' ', $company) : 'Not provided';
$safeEmail = preg_replace("/[\r\n]+/", ' ', $email) ?: $email;
$safeType = $inquiryType === 'free-quote' ? 'Free Quote Request' : 'Assessment Request';
$submittedAt = date('F j, Y g:i A');

$subject = '[Technoshine] ' . $safeType . ' from ' . $safeName;
$plainBody = "New inquiry from the Technoshine website\n\n"
    . "Inquiry Type: {$safeType}\n"
    . "Submitted At: {$submittedAt}\n"
    . "Name: {$safeName}\n"
    . "Email: {$safeEmail}\n"
    . "Company: {$safeCompany}\n\n"
    . "Message:\n{$message}\n";

$htmlBody = '<!DOCTYPE html>'
    . '<html lang="en">'
    . '<body style="margin:0;padding:0;background-color:#f4f1eb;font-family:Arial,sans-serif;color:#111827;">'
    . '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f1eb;">'
    . '<tr>'
    . '<td align="center" style="padding:32px 16px;">'
    . '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:680px;background-color:#111111;border:1px solid #2b2b2b;">'
    . '<tr>'
    . '<td style="padding:24px 28px;background:linear-gradient(135deg,#121212 0%,#20150d 100%);border-bottom:1px solid #3b2b20;">'
    . '<p style="margin:0 0 8px 0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#ff8a3d;">Technoshine Website</p>'
    . '<h1 style="margin:0;font-size:28px;line-height:1.2;color:#ffffff;font-weight:700;">New Inquiry Received</h1>'
    . '<p style="margin:10px 0 0 0;font-size:14px;line-height:1.6;color:#d4d4d4;">A new customer message has been submitted through the contact form.</p>'
    . '</td>'
    . '</tr>'
    . '<tr>'
    . '<td style="padding:28px;background-color:#ffffff;">'
    . '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:separate;border-spacing:0 12px;">'
    . '<tr>'
    . '<td style="width:50%;padding:16px 18px;background-color:#f8f8f8;border:1px solid #e5e7eb;">'
    . '<p style="margin:0 0 6px 0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#f97316;">Inquiry Type</p>'
    . '<p style="margin:0;font-size:16px;color:#111827;font-weight:700;">' . htmlspecialchars($safeType, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</p>'
    . '</td>'
    . '<td style="width:50%;padding:16px 18px;background-color:#f8f8f8;border:1px solid #e5e7eb;">'
    . '<p style="margin:0 0 6px 0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#f97316;">Submitted</p>'
    . '<p style="margin:0;font-size:16px;color:#111827;font-weight:700;">' . htmlspecialchars($submittedAt, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</p>'
    . '</td>'
    . '</tr>'
    . '<tr>'
    . '<td style="width:50%;padding:16px 18px;background-color:#f8f8f8;border:1px solid #e5e7eb;">'
    . '<p style="margin:0 0 6px 0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#f97316;">Customer Name</p>'
    . '<p style="margin:0;font-size:16px;color:#111827;font-weight:700;">' . htmlspecialchars($safeName, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</p>'
    . '</td>'
    . '<td style="width:50%;padding:16px 18px;background-color:#f8f8f8;border:1px solid #e5e7eb;">'
    . '<p style="margin:0 0 6px 0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#f97316;">Email Address</p>'
    . '<p style="margin:0;font-size:16px;color:#111827;font-weight:700;">' . htmlspecialchars($safeEmail, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</p>'
    . '</td>'
    . '</tr>'
    . '<tr>'
    . '<td colspan="2" style="padding:16px 18px;background-color:#f8f8f8;border:1px solid #e5e7eb;">'
    . '<p style="margin:0 0 6px 0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#f97316;">Property / Company</p>'
    . '<p style="margin:0;font-size:16px;color:#111827;font-weight:700;">' . htmlspecialchars($safeCompany, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</p>'
    . '</td>'
    . '</tr>'
    . '</table>'
    . '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:8px;border:1px solid #e5e7eb;background-color:#fafaf9;">'
    . '<tr>'
    . '<td style="padding:18px 20px;border-bottom:1px solid #e5e7eb;">'
    . '<p style="margin:0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#f97316;">Customer Message</p>'
    . '</td>'
    . '</tr>'
    . '<tr>'
    . '<td style="padding:20px;font-size:15px;line-height:1.8;color:#374151;white-space:pre-wrap;">'
    . nl2br(htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'))
    . '</td>'
    . '</tr>'
    . '</table>'
    . '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:18px;background-color:#111111;">'
    . '<tr>'
    . '<td style="padding:16px 20px;font-size:13px;line-height:1.7;color:#d4d4d4;">'
    . 'Reply directly to this email to respond to <strong style="color:#ffffff;">' . htmlspecialchars($safeName, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</strong>.'
    . '</td>'
    . '</tr>'
    . '</table>'
    . '</td>'
    . '</tr>'
    . '</table>'
    . '</td>'
    . '</tr>'
    . '</table>'
    . '</body>'
    . '</html>';

try {
    sendSmtpMail(
        $smtpHost,
        $smtpPort,
        $smtpUser,
        $smtpPass,
        $fromEmail,
        $fromName,
        $toEmail,
        $safeEmail,
        $subject,
        $plainBody,
        $htmlBody
    );

    echo json_encode([
        'ok' => true,
        'message' => 'Inquiry sent successfully.',
        'deliveredTo' => $toEmail,
    ]);
} catch (Throwable $exception) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => 'Unable to send your inquiry right now.',
        'error' => $exception->getMessage(),
    ]);
}

function sendSmtpMail(
    string $host,
    int $port,
    string $username,
    string $password,
    string $fromEmail,
    string $fromName,
    string $toEmail,
    string $replyTo,
    string $subject,
    string $plainBody,
    string $htmlBody
): void {
    $transport = "ssl://{$host}:{$port}";
    $socket = @stream_socket_client($transport, $errno, $errstr, 20, STREAM_CLIENT_CONNECT);

    if (!$socket) {
        throw new RuntimeException("SMTP connection failed: {$errstr} ({$errno})");
    }

    stream_set_timeout($socket, 20);

    expectSmtpCode($socket, [220]);
    smtpCommand($socket, "EHLO {$host}", [250]);
    smtpCommand($socket, 'AUTH LOGIN', [334]);
    smtpCommand($socket, base64_encode($username), [334]);
    smtpCommand($socket, base64_encode($password), [235]);
    smtpCommand($socket, "MAIL FROM:<{$fromEmail}>", [250]);
    smtpCommand($socket, "RCPT TO:<{$toEmail}>", [250, 251]);
    smtpCommand($socket, 'DATA', [354]);

    $headers = [
        'Date: ' . date(DATE_RFC2822),
        'From: ' . encodeDisplayName($fromName) . " <{$fromEmail}>",
        "To: <{$toEmail}>",
        'Reply-To: <' . $replyTo . '>',
        'MIME-Version: 1.0',
        'Subject: ' . encodeHeader($subject),
    ];

    $boundary = 'b1_' . bin2hex(random_bytes(12));
    $headers[] = 'Content-Type: multipart/alternative; boundary="' . $boundary . '"';

    $message = implode("\r\n", $headers) . "\r\n\r\n"
        . "--{$boundary}\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: 8bit\r\n\r\n"
        . normalizeSmtpBody($plainBody) . "\r\n"
        . "--{$boundary}\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: 8bit\r\n\r\n"
        . normalizeSmtpBody($htmlBody) . "\r\n"
        . "--{$boundary}--\r\n.";

    fwrite($socket, $message . "\r\n");
    expectSmtpCode($socket, [250]);
    smtpCommand($socket, 'QUIT', [221]);
    fclose($socket);
}

function smtpCommand($socket, string $command, array $expectedCodes): string
{
    fwrite($socket, $command . "\r\n");
    return expectSmtpCode($socket, $expectedCodes);
}

function expectSmtpCode($socket, array $expectedCodes): string
{
    $response = '';

    while (($line = fgets($socket, 515)) !== false) {
        $response .= $line;
        if (isset($line[3]) && $line[3] === ' ') {
            break;
        }
    }

    if ($response === '') {
        throw new RuntimeException('Empty SMTP response.');
    }

    $code = (int)substr($response, 0, 3);
    if (!in_array($code, $expectedCodes, true)) {
        throw new RuntimeException(trim($response));
    }

    return $response;
}

function encodeHeader(string $value): string
{
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

function encodeDisplayName(string $value): string
{
    return encodeHeader($value);
}

function normalizeSmtpBody(string $value): string
{
    $normalized = str_replace(["\r\n", "\r"], "\n", $value);
    $normalized = preg_replace('/^\./m', '..', $normalized);
    return str_replace("\n", "\r\n", $normalized);
}
