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

/*
$id = '-N_uc8mrSUG05GC1HN8I';
$retrieve = $db->retrieve("sources/$id");
// $datas = json_decode($retrieve, 1);
$apiResult = json_decode($retrieve, true);

//echo ($apiResult['date']);
$today = $apiResult['value'];
$next = $apiResult['nextvalue'];
$fechaval02 = $apiResult['date'];
$fechabcv02 = $apiResult['nextdate'];



$fechabcv = date('l, d F Y', strtotime($fechabcv02));
$fechabcv = str_replace($D_en,$D_es,$fechabcv);
$fechabcv = str_replace($M_en,$M_es,$fechabcv);

*/
setlocale(LC_TIME,"es_ES");
date_default_timezone_set('America/Caracas');
$fechaActual = date("d-m-Y");

    function _checkFileExists($url)
    {
        $headers = @get_headers($url);
        if($headers[0] == 'HTTP/1.1 404 Not Found') {
            return false;
        }else{
            return true;

        }

    }

 $urlBan = 'https://www.banesco.com/personas/sistema-mercado-cambiario-personas/sistema-de-mercado-cambiario';
 //_checkFileExists($urlBan);
    
 if(_checkFileExists($urlBan)){
    $urlBan = file_get_contents($urlBan);
            //creamos nuevo DOMDocument y cargamos la url
            $dom = new DOMDocument();
            @$dom->loadHTML($urlBan);
            
            //obtenemos todos los div de la url
            $ps = $dom->getElementsByTagName( 'p' );
            $divs = $dom->getElementsByTagName( 'table' );
            
            //recorremos los divs
            foreach( $ps as $p ){
                //
                if( $p->getAttribute( 'class' ) === 'fecha-valor' ){
                    $fechaval = $p->nodeValue;
                    $fechaval =str_replace('Fecha Valor: ', '', $fechaval);
                    $fechaval =str_replace(' de ', ' ', $fechaval);

                    $fechaval02 = ucwords($fechaval);
                    $fechaval02 = str_replace($D_es,"",$fechaval02);
                     $fechaval02 = str_replace($M_es,$M_en,$fechaval02);
                    // $fechaval02 = strftime('%d-%m-%Y', strtotime($fechaval02));
                     $fechaval02 = date('d-m-Y', strtotime($fechaval02));
                        break;
                }
            }
            foreach( $divs as $div ){
                //
                if( $div->getAttribute( 'class' ) === 'menudeo' ){
                    $today = $div->childNodes[5]->childNodes[3]->nodeValue;

                    $today = (string)$today;
                    $today = str_replace(',','.',$today);
                    $today = (floatval($today));
                    $today = round($today,2);
                   
                    break;
                }
    
            }
            $id = '-N_ucSGO8v918mZreEk1';
            $update = $db->update("sources", $id, [
                "value"     => $today,
                "date"      => $fechaval02,
            ]);

 }


 //   setlocale(LC_TIME,"es_ES");

 $urlbcv = 'https://www.bcv.org.ve/tasas-informativas-sistema-bancario';
 //_checkFileExists($urlBan);
    
 if(_checkFileExists($urlbcv)){
            $urlbcv = file_get_contents($urlbcv);

            $title = 0;
            $x = 0;
            
        //creamos nuevo DOMDocument y cargamos la url
        $dom = new DOMDocument();
        @$dom->loadHTML($urlbcv);
            
        //obtenemos todos los div de la url
        $divs = $dom->getElementsByTagName( 'div' );
            
        //recorremos los divs
        foreach( $divs as $div ){
            //si encentramos la clase mc-title nos quedamos con el titulo
            if( $div->getAttribute( 'class' ) === 'col-sm-6 col-xs-6 centrado' ){
                $x = $x + 1;
                if($x == 5){
                    $next = $div->nodeValue;

                    $next = (string)$next;
                    $next = str_replace(',','.',$next);
                    $next = (floatval($next));
                    $next = round($next,2);
                }
            }
            if( $div->getAttribute( 'class' ) === 'pull-right dinpro center' ){
                $fechabcv = $div->childNodes[1]->nodeValue;

                $fechabcv = str_replace('  ',' ',$fechabcv);
   
                $fechabcv02 = ucwords($fechabcv);
                $fechabcv02 = str_replace($D_es,"",$fechabcv02);
                 $fechabcv02 = str_replace($M_es,$M_en,$fechabcv02);
                 $fechabcv02 = date('d-m-Y', strtotime($fechabcv02));
                break;
            }
        
        }
        $id = '-N_uc8mrSUG05GC1HN8I';
        if ($fechaActual == $fechaval02) {
            $update = $db->update("sources", $id, [
                "value"         => $next,
                "date"          => $fechabcv02,
                "nextvalue"     => $next,
                "nextdate"      => $fechabcv02,
            ]);
        }else {
            $update = $db->update("sources", $id, [
                "nextvalue"     => $next,
                "nextdate"      => $fechabcv02,
            ]);
        }

    }



// $fechabcv = 'Jueves, 20 Julio 2023';
// $next = 28;





   //  echo strftime('%d-%m-%Y', strtotime($fechabcv));
    // echo strftime('%F', strtotime("10 September 2000"));
/*
    $json = array("USDToday"=>$today,"DateToday"=>$fechaval,"DateToday2"=>$fechaval02,"USDNext"=>$next,"DateNext"=>$fechabcv,"DateNext2"=>$fechabcv02,"DateNow"=>$fechaActual);
    $json_data = json_encode($json);
    echo $json_data;
*/    

 ?>