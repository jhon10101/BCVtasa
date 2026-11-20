<?php
header('Content-Type: application/json; charset=UTF-8');

// ─────────────────────────────────────────────
// Leer cuerpo JSON (o POST clásico como respaldo)
// ─────────────────────────────────────────────
$json_data = file_get_contents('php://input');
$data      = json_decode($json_data, true);
if (!is_array($data)) {
    $data = $_POST;
}

// ─────────────────────────────────────────────
// Convierte cualquier formato de fecha a DD-MM-YYYY
// Acepta: YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY, etc.
// ─────────────────────────────────────────────
function normalizeToDDMMYYYY($d) {
    if (!$d) return '';
    $clean = trim(str_replace(['/', '.'], '-', $d));
    $parts = explode('-', $clean);
    if (count($parts) === 3) {
        if (strlen($parts[0]) === 4) {
            // YYYY-MM-DD → DD-MM-YYYY
            return sprintf('%02d-%02d-%04d', (int)$parts[2], (int)$parts[1], (int)$parts[0]);
        }
        // DD-MM-YYYY (o similar)
        return sprintf('%02d-%02d-%04d', (int)$parts[0], (int)$parts[1], (int)$parts[2]);
    }
    return $clean;
}

// ─────────────────────────────────────────────
// Convierte DD-MM-YYYY o YYYY-MM-DD a formato ISO (YYYY-MM-DD)
// ─────────────────────────────────────────────
function normalizeToISO($d) {
    if (!$d) return '';
    $clean = trim(str_replace(['/', '.'], '-', $d));
    $parts = explode('-', $clean);
    if (count($parts) === 3) {
        if (strlen($parts[0]) === 4) {
            return sprintf('%04d-%02d-%02d', (int)$parts[0], (int)$parts[1], (int)$parts[2]);
        }
        // DD-MM-YYYY → YYYY-MM-DD
        return sprintf('%04d-%02d-%02d', (int)$parts[2], (int)$parts[1], (int)$parts[0]);
    }
    return $clean;
}

// ─────────────────────────────────────────────
// Leer y validar las dos fechas recibidas
// ─────────────────────────────────────────────
$startDate = $data['startDate'] ?? null;
$endDate   = $data['endDate']   ?? null;

if (!$startDate || !$endDate) {
    echo json_encode([
        'Status'  => 400,
        'Message' => 'Parámetros "startDate" y "endDate" requeridos.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Normalizar ambas fechas al formato ISO (YYYY-MM-DD) para la API externa
$startFormatted = normalizeToISO($startDate);
$endFormatted   = normalizeToISO($endDate);

// ─────────────────────────────────────────────
// Clave de acceso — reemplazar con la clave real
// ─────────────────────────────────────────────
$access_key = '8a258f4e4b4412eb7930e87473516170';

// URL de la API externa de histórico
// $externalUrl = 'http://localhost/PHP/ApiRestCalculator/v1/sources/bcvhistoric.php';
$externalUrl = 'https://forward-deena-jhonny91.koyeb.app/v1/sources/bcvhistoric.php';

// Payload: dos fechas + access_key
$payload = json_encode([
    'startDate'  => $startFormatted,
    'endDate'    => $endFormatted,
    'access_key' => $access_key,
]);

// ─────────────────────────────────────────────
// Llamada cURL a la API externa (una sola solicitud)
// ─────────────────────────────────────────────
if (!function_exists('curl_init')) {
    echo json_encode([
        'Status'  => 500,
        'Message' => 'cURL no disponible en este servidor.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$ch = curl_init($externalUrl);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_TIMEOUT        => 10,
    CURLOPT_SSL_VERIFYPEER => false,
]);
$response  = curl_exec($ch);
$httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// ─────────────────────────────────────────────
// Procesar respuesta de la API externa
//
// Respuesta esperada de la API externa:
// {
//   "Name":    "BCVhistoric",
//   "StartDate": "18-11-2026",
//   "StartUSD":  916.65,
//   "StartEURO": 1007.39,
//   "EndDate":   "19-11-2026",
//   "EndUSD":    917.78,
//   "EndEURO":   1007.40,
//   "DateOld":   "05-05-2026",
//   "DateLast":  "20-11-2026",
//   "Status":    200
// }
// ─────────────────────────────────────────────
if ($httpCode === 200 && $response) {
    $ext = json_decode($response, true);

    if (is_array($ext) && isset($ext['Status']) && (int)$ext['Status'] === 200) {

        // Convertir DateOld / DateLast a ISO para que el JS los use en los calendarios
        $minDateIso = normalizeToISO($ext['DateOld']  ?? '');
        $maxDateIso = normalizeToISO($ext['DateLast'] ?? '');

        // Construir respuesta unificada para el frontend
        $out = [
            'Status'     => 200,
            'Name'     => $ext['Name'] ?? 'BCVhistoric',

            // Fecha inicio y sus tasas
            'StartDate'  => $ext['StartDate'] ?? $startFormatted,
            'StartUSD'   => isset($ext['StartUSD'])  ? (float)$ext['StartUSD']  : null,
            'StartEURO'  => isset($ext['StartEURO']) ? (float)$ext['StartEURO'] : null,

            // Fecha fin y sus tasas
            'EndDate'    => $ext['EndDate'] ?? $endFormatted,
            'EndUSD'     => isset($ext['EndUSD'])  ? (float)$ext['EndUSD']  : null,
            'EndEURO'    => isset($ext['EndEURO']) ? (float)$ext['EndEURO'] : null,

            // Rango de fechas disponibles (para los calendarios)
            'DateOld'    => $ext['DateOld']  ?? '',
            'DateLast'   => $ext['DateLast'] ?? '',
            'MinDateIso' => $minDateIso,
            'MaxDateIso' => $maxDateIso,
        ];

        echo json_encode($out, JSON_UNESCAPED_UNICODE);
        exit;
    }

    // La API respondió HTTP 200 pero con Status de error interno
    $errMsg = $ext['Message'] ?? $ext['message'] ?? 'La API externa devolvió un error.';
    echo json_encode([
        'Status'  => 502,
        'Message' => $errMsg
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Error de red / cURL o código HTTP != 200
$detail = $curlError ? "cURL: $curlError" : "HTTP $httpCode";
echo json_encode([
    'Status'  => 500,
    'Message' => "Error al conectar con la API histórica. ($detail)"
], JSON_UNESCAPED_UNICODE);
exit;
