<?php

//$D_es = array("Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo");
$D_es = array("Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom");
$D_en = array("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");

$days = $_POST["sourceID"];
//$days = 2;
//$num = 5;
$day = 'P'.$days.'D';
$fecha = "02-05-2024";
$fechaHoy = "06-05-2024";
$formatoFecha = "d-m-Y";
$fechaObj = DateTime::createFromFormat($formatoFecha, $fecha);
$fechaHoy = DateTime::createFromFormat($formatoFecha, $fechaHoy);
$fechaObj->add(new DateInterval($day));
if ($fechaObj < $fechaHoy) {
  $num = 5;
  $day = 'P'.$num.'D';
  $fechaObj->add(new DateInterval($day));
}
//$fecha1 = date_format($fechaObj, "D d/m/Y");
//$fecha = date('l, d F Y', strtotime($fecha1));
$fecha = date_format($fechaObj, "l d/m/Y");
$fecha1 = str_replace($GLOBALS['D_en'],$GLOBALS['D_es'],$fecha);

echo '<div class="col-12 my-2 p-0 px-2  fs-1  fw-bold">
<span  class="align-middle">'.$fecha1.'</span>
</div>';

for ($i = 0; $i < 5; $i++) {
    $num = 5;
    $day = 'P'.$num.'D';
    $fechaObj->add(new DateInterval($day));
    $fecha = date_format($fechaObj, "l d/m/Y");
    $fecha1 = str_replace($GLOBALS['D_en'],$GLOBALS['D_es'],$fecha);
    echo '<div class="col-12 my-2 p-0 px-2  fs-2">
    <span  class="align-middle">'.$fecha1.'</span>
    </div>';
}

?>
