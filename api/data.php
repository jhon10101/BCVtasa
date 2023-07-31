<?php
$abc = $_POST["source"];
if ("name" == $abc){
  //  echo "bcv";
}

$queryString = http_build_query([
    'access_key' => 'bdc0ad587af413b335abe28b50cd561a',
  ]);
  
  $ch = curl_init(sprintf('%s?%s', 'https://apirestcalculator-production.up.railway.app/v1/sources/bcv.php', $queryString));

  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    
  $json = curl_exec($ch);
                    
  curl_close($ch);
 
    echo $json;
    

 ?>