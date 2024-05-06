<?php
$source = $_POST["source"];

$queryString = http_build_query([
    'access_key' => 'bdc0ad587af413b335abe28b50cd561a',
  ]);
  
  if ("BCV" == $source){
        $ch = curl_init(sprintf('%s?%s', 'https://forward-deena-jhonny91.koyeb.app/v1/sources/bcv.php', $queryString));
    } elseif ("PDVSA" === $source) {
        $ch = curl_init(sprintf('%s?%s', 'https://forward-deena-jhonny91.koyeb.app/v1/sources/pdvsa.php', $queryString));
    } else {
      $ch = curl_init(sprintf('%s?%s', 'https://forward-deena-jhonny91.koyeb.app/v1/sources/paralelo.php', $queryString));
  }

  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    
  $json = curl_exec($ch);
                    
  curl_close($ch);
 
    echo $json;
    

 ?>