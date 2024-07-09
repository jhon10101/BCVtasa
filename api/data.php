<?php
$source = $_POST["source"];

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
      } elseif ("PDVSA" === $source) {
            $ch = curl_init(sprintf('%s?%s', 'https://forward-deena-jhonny91.koyeb.app/v1/sources/pdvsa.php', $queryString));

            $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            // Verificar si la solicitud cURL fue exitosa
            if (($http_code !== 200) || ($ch === false)) {
                $ch = curl_init(sprintf('%s?%s', 'https://apibcv.azurewebsites.net/v1/sources/pdvsa.php', $queryString));
                // echo "Error al ejecutar cURL: " . curl_error($ch);
            }
      } else {
            $ch = curl_init(sprintf('%s?%s', 'https://forward-deena-jhonny91.koyeb.app/v1/sources/paralelo.php', $queryString));

            $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            // Verificar si la solicitud cURL fue exitosa
            if (($http_code !== 200) || ($ch === false)) {
                $ch = curl_init(sprintf('%s?%s', 'https://apibcv.azurewebsites.net/v1/sources/paralelo.php', $queryString));
              // echo "Error al ejecutar cURL: " . curl_error($ch);
            }
  }

  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    
  $json = curl_exec($ch);
                    
  curl_close($ch);
 
    echo $json;
    

 ?>
