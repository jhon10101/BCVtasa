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
 
 $today = round($today,2);

    setlocale(LC_TIME,"es_ES");


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

   $next = round($next,2);

     $json = array("USDToday"=>$today,"DateToday"=>$fechaval,"USDNext"=>$next,"DateNext"=>$fechabcv);
     $json_data = json_encode($json);
     echo $json_data;

 ?>