<?php


 $url = file_get_contents('https://www.banesco.com/personas/sistema-mercado-cambiario-personas/sistema-de-mercado-cambiario');
 $today = 0;
 
//creamos nuevo DOMDocument y cargamos la url
$dom = new DOMDocument();
@$dom->loadHTML($url);
 
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
            break;
    }
}
foreach( $divs as $div ){
    //
    if( $div->getAttribute( 'class' ) === 'menudeo' ){
        $today = $div->childNodes[5]->childNodes[3]->nodeValue;
        break;
    }

}

 $today = (string)$today;
 $today = str_replace(',','.',$today);
 $today = (floatval($today));
 $today = round($today,2);

 //   setlocale(LC_TIME,"es_ES");

/*
    $url = file_get_contents('https://www.bcv.org.ve/');
    $title = 0;
    $x = 0;
    
   //creamos nuevo DOMDocument y cargamos la url
   $dom = new DOMDocument();
   @$dom->loadHTML($url);
    
   //obtenemos todos los div de la url
   $divs = $dom->getElementsByTagName( 'div' );
    
   //recorremos los divs
   foreach( $divs as $div ){
       //si encentramos la clase mc-title nos quedamos con el titulo
       if( $div->getAttribute( 'class' ) === 'col-sm-6 col-xs-6 centrado' ){
         $x = $x + 1;
         if($x == 5){
            $next = $div->nodeValue;
         }
       }
       if( $div->getAttribute( 'class' ) === 'pull-right dinpro center' ){
           $fechabcv = $div->childNodes[1]->nodeValue;
           break;
      }
   
   }

   $fechabcv = str_replace('  ',' ',$fechabcv);
   $next = (string)$next;
   $next = str_replace(',','.',$next);
   $next = (floatval($next));
   $next = round($next,2);
*/
$fechabcv = 'Jueves, 20 Julio 2023';
$next = 28;


     $M_es = array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
     $M_en = array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
     $D_es = array("Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo");
     $D_en = array("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");
     setlocale(LC_TIME,"es_ES");
     $fechaval02 = ucwords($fechaval);
     $fechaval02 = str_replace($D_es,"",$fechaval02);
      $fechaval02 = str_replace($M_es,$M_en,$fechaval02);
     // $fechaval02 = strftime('%d-%m-%Y', strtotime($fechaval02));
      $fechaval02 = date('d-m-Y', strtotime($fechaval02));

      $fechabcv02 = ucwords($fechabcv);
      $fechabcv02 = str_replace($D_es,"",$fechabcv02);
       $fechabcv02 = str_replace($M_es,$M_en,$fechabcv02);
       $fechabcv02 = date('d-m-Y', strtotime($fechabcv02));

       date_default_timezone_set('America/Caracas');
       $fechaActual = date("d-m-Y");

   //  echo strftime('%d-%m-%Y', strtotime($fechabcv));
    // echo strftime('%F', strtotime("10 September 2000"));

    $json = array("USDToday"=>$today,"DateToday"=>$fechaval,"DateToday2"=>$fechaval02,"USDNext"=>$next,"DateNext"=>$fechabcv,"DateNext2"=>$fechabcv02,"DateNow"=>$fechaActual);
    $json_data = json_encode($json);
    echo $json_data;
    

 ?>