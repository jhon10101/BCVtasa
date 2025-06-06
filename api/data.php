<?php
header('Content-Type: application/json'); // Opcional pero recomendado: indica que tu respuesta será JSON
//$source = $_POST["source"];
$json_data = file_get_contents('php://input');

// Decodificar los datos JSON a un array asociativo de PHP
// El 'true' como segundo argumento hace que json_decode devuelva un array asociativo en lugar de un objeto
$data = json_decode($json_data, true);

$source = null;

// Verificar si la decodificación fue exitosa y si la clave 'source' existe en el array decodificado
if ($data !== null && isset($data['source'])) {
    $source = $data['source'];
    if ($source === 'PDVSA' ){
        $plateOffset = $data['plateOffset'];
    }
    
    // Ahora la variable $source contiene el valor enviado desde JavaScript (por ejemplo, 'BCV')

    // --- Aquí va el resto de tu lógica PHP para obtener las tasas según $source ---
    // ... (tu código actual que usa $source para decidir qué datos devolver) ...

    // Ejemplo (adapta esto a tu lógica real):
}
//$source = "BCVEuro" ;
//$plateOffset = 3;
//$source =  "PDVSA";
$queryString = http_build_query([
    'access_key' => 'bdc0ad587af413b335abe28b50cd561a',
  ]);
  
    if ("BCV" == $source){
            $ch = curl_init(sprintf('%s?%s', 'https://forward-deena-jhonny91.koyeb.app/v1/sources/bcv.php', $queryString));

            $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            // Verificar si la solicitud cURL fue exitosa
            if (($http_code !== 200) || ($ch === false)) {
                $ch = curl_init(sprintf('%s?%s', 'https://apibcv.azurewebsites.net/v1/sources/bcv.php', $queryString));
                // echo "Error al ejecutar cURL: " . curl_error($ch);
            }

    } elseif ("BCVEuro" == $source) { // <-- NUEVA LÓGICA PARA EURO

            $ch = curl_init(sprintf('%s?%s', 'https://forward-deena-jhonny91.koyeb.app/v1/sources/bcveuro.php', $queryString));

            $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            // Verificar si la solicitud cURL fue exitosa
            if (($http_code !== 200) || ($ch === false)) {
              //  $ch = curl_init(sprintf('%s?%s', 'https://apibcv.azurewebsites.net/v1/sources/bcveuro.php', $queryString));
                // echo "Error al ejecutar cURL: " . curl_error($ch);
            }
            // Aquí puedes intentar obtener datos de una API real si existe,
            // o usar los datos de ejemplo que proporcionaste.
            // Por simplicidad y para mostrar la funcionalidad, usaremos tus datos de ejemplo.
            /*
            $response_data = [
                "Source" => "BCVEuro",
                "EURO" => 111.90, // Asegúrate de que los valores sean floats
                "Date" => "05-06-2025",
                "DateFormat" => "Jueves, 05 Junio 2025",
                "EURONext" => 112.93, // Este valor puede ser null o no existir para "no próximo"
                "DateNext" => "06-06-2025",
                "DateFormatNext" => "Viernes, 06 Junio 2025",
                "DateNow" => "05-06-2025",
                "Status" => 200
            ];
            echo json_encode($response_data);
            die; // Detener la ejecución del script aquí para enviar solo esta respuesta
            */

        }elseif ($source === 'PDVSA' && $plateOffset !== null) {
                // Es una petición para el calendario de placa de PDVSA
            
                // URL de la API externa de PDVSA para obtener la fecha base
             //   $external_api_url = 'https://forward-deena-jhonny91.koyeb.app/v1/sources/pdvsa.php', $queryString; // Tu URL
            
                $ch = curl_init(sprintf('%s?%s', 'https://forward-deena-jhonny91.koyeb.app/v1/sources/pdvsa.php', $queryString));// Inicializar cURL con la URL
            
                // Configurar opciones de cURL
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Devuelve la respuesta como string en lugar de imprimirla
                curl_setopt($ch, CURLOPT_HEADER, false);       // No incluir las cabeceras en la respuesta devuelta
                // curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Opcional: seguir redirecciones
            
                // --- Ejecutar la petición cURL ---
                $external_response_json = curl_exec($ch); // Ejecutar y obtener la respuesta cruda en formato string
                $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE); // Obtener el código HTTP *después* de la ejecución
                $curl_error = curl_error($ch); // Obtener mensaje de error de cURL si lo hubo
            
                curl_close($ch); // Cerrar la sesión cURL
            
                // --- Verificar si la petición fue exitosa y la respuesta es válida ---
                if ($curl_error || $http_code !== 200) {
                    // Ocurrió un error en cURL o la API externa devolvió un status no 200
                    error_log("Error cURL al obtener datos base de PDVSA: " . $curl_error . " - Código HTTP: " . $http_code);
                    $response_data = ["Status" => 500, "Message" => "Error al obtener datos base de PDVSA."];
            
                } else {
                    // La petición cURL fue exitosa, ahora intentar decodificar el JSON
                    $external_data = json_decode($external_response_json, true);
            
                    // Verificar si la decodificación fue exitosa y si los datos necesarios existen y son válidos
                    if ($external_data === null || !isset($external_data['Status']) || $external_data['Status'] !== 200 || !isset($external_data['DatePlaca'])) {
                         // La respuesta no es un JSON válido, no tiene el status 200 o no tiene DatePlaca
                         error_log("Datos inválidos o incompletos de la API externa de PDVSA: " . $external_response_json); // Loguear la respuesta cruda para depurar
                         $response_data = ["Status" => 500, "Message" => "Datos base de PDVSA inválidos."];
            
                    } else {
                        // Los datos base se obtuvieron y decodificaron correctamente, proceder con el cálculo de fechas
                        $datePlacaString = $external_data['DatePlaca']; // Fecha base en formato "mm-dd-yyyy"
                        $dateString = $external_data['Date']; // Fecha actual en formato "mm-dd-yyyy"
            
                        // 2. Calcular la fecha base para la placa seleccionada
                        // Usar DateTime::createFromFormat es más seguro para parsear fechas con formatos específicos
                        $formatoFecha = "m-d-Y";
                        $datePlaca = DateTime::createFromFormat($formatoFecha, $datePlacaString);
                        $fechaHoy = DateTime::createFromFormat($formatoFecha, $dateString);
            
                        if ($datePlaca) {
                            // Clonar la fecha y añadir el offset de días según la placa
                            $placaBaseDate = clone $datePlaca;
                            $todayDate = clone $fechaHoy;
                            $placaBaseDate->modify("+$plateOffset days"); // Añadir el offset recibido desde JS
                            $numDays = 5;
                            if ($placaBaseDate < $todayDate) {
                                $placaBaseDate->modify("+$numDays days");
                            }
            
                            // 3. Calcular las 6 fechas siguientes con intervalos de 5 días
                            $calculatedDates = [];
                            $currentDate = clone $placaBaseDate; // Empezar desde la fecha base de la placa
            
                            // Días de la semana en español para el formato
                            $daysOfWeekSpanish = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
            
                            for ($i = 0; $i < 6; $i++) {
                                // 4. Formatear la fecha como "Dia de la semana dd/mm/aaaa"
                                $dayOfWeekIndex = $currentDate->format('w'); // Obtener el índice del día de la semana (0=Dom, 6=Sáb)
                                $dayOfWeekSpanish = $daysOfWeekSpanish[$dayOfWeekIndex];
                                $formattedDate = $currentDate->format('d/m/Y'); // Formatear como dd/mm/yyyy
            
                                $calculatedDates[] = "$dayOfWeekSpanish $formattedDate"; // Añadir al array de resultados
            
                                // Sumar 5 días para la siguiente fecha en la secuencia
                                $currentDate->modify("+5 days");
                            }
            
                            // 5. Preparar la respuesta exitosa con la lista de fechas calculadas
                            $response_data = [
                                "Status" => 200,
                                "Dates" => $calculatedDates // Devolver el array de fechas formateadas
                            ];
                            echo json_encode($response_data);
                            die;
                        } else {
                            // Error si no se pudo parsear la fecha base obtenida de la API externa
                            error_log("Error al parsear DatePlaca '" . $datePlacaString . "' usando format 'm-d-Y'");
                            $response_data = ["Status" => 500, "Message" => "Error interno al procesar la fecha base."];
                        }
                    }
                }
        
        $ch = $response_data;
        
    

    } elseif ("Paralelo" == $source) {
        $ch = curl_init(sprintf('%s?%s', 'https://forward-deena-jhonny91.koyeb.app/v1/sources/paralelo.php', $queryString));

       $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

       // Verificar si la solicitud cURL fue exitosa
       if (($http_code !== 200) || ($ch === false)) {
          //  $ch = curl_init(sprintf('%s?%s', 'https://apibcv.azurewebsites.net/v1/sources/paralelo.php', $queryString));
           // echo "Error al ejecutar cURL: " . curl_error($ch);
        }
    }

  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    
  $json = curl_exec($ch);
                    
  curl_close($ch);
 
    echo $json;
    

 ?>