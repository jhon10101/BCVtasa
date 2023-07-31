<?php

include("../model/config.php");
include("../model/firebaseRDB.php");

$today = 0;
$next = 0;
$fechaval = '0';
$fechabcv = '0';
$fechaval02 = '0';
$fechabcv02 = '0';

$M_es = array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
$M_en = array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
$D_es = array("Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo");
$D_en = array("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");


$db = new firebaseRDB($databaseURL);
$id = '-N_uc8mrSUG05GC1HN8I';
$retrieve = $db->retrieve("sources/$id");
// $datas = json_decode($retrieve, 1);
$apiResult = json_decode($retrieve, true);

//echo ($apiResult['date']);
$today = $apiResult['value'];
$next = $apiResult['nextvalue'];
$fechaval02 = $apiResult['date'];
$fechabcv02 = $apiResult['nextdate'];

setlocale(LC_TIME,"es_ES");
date_default_timezone_set('America/Caracas');
$fechaActual = date("d-m-Y");

$queryString = http_build_query([
   // 'lang' => 'sp',
   // 'access_key' => 'a15f4e6273505d91968e009e59b06ccb',
  ]);
                    
  $ch = curl_init(sprintf('%s?%s', 'https://apirestcalculator-production.up.railway.app/sources/bcv.php', $queryString));
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    
  $json = curl_exec($ch);
                    
  curl_close($ch);
                    
  //$apiResult = json_decode($json, true);

  //$jsonstring = $apiResult;
  //$city = ($jsonstring['city']);

  //  $json = array("USDToday"=>$today,"DateToday"=>$fechaval,"DateToday2"=>$fechaval02,"USDNext"=>$next,"DateNext"=>$fechabcv,"DateNext2"=>$fechabcv02,"DateNow"=>$fechaActual);
  //  $json_data = json_encode($json);
  //{"Source":"BCV","USD":"29.88","Date":"21-07-2023","DateFormat":"Viernes, 21 Julio 2023","USDNext":29.09,"DateNext":"25-07-2023","DateFormatNext":"Martes, 25 Julio 2023","DateNow":"24-07-2023","Status":200}
    echo $json;
    

 ?>