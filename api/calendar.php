<?php

// Definir variables
$x = 0;
$y = 0;
$dias = 0;
$dias1 = 5;

// Obtener el día de la fuente
$day = (int) $_GET["sourceID"];

// Bucle para recorrer los días
for ($i = 0; $i < 5; $i++) {
  // Incrementar el contador
  $x++;

  // Sumar días a la fecha
  $fecha = date_create("today");
  date_add($fecha, date_interval_create_from_date_string("$dias days"));

  // Formatear la fecha
  $fecha1 = date_format($fecha, "D d/m/Y");

  // Convertir la fecha a formato local
  $datetoday = date_format($fecha, "Y-m-d");
  $dateHoy = date_format(date_create("today"), "Y-m-d");

  // Calcular el identificador del elemento
  $fechax = $x * 10;

  // Si la fecha actual es mayor o igual a la fecha del bucle, mostrar la fecha formateada
  if ($datetoday >= $dateHoy) {
    echo "<p id=\"$fechax\">$fecha1</p>";
  } else {
    // Si no, restar un día al contador y al índice del bucle
    $x--;
    $i--;
  }

  // Restablecer el valor de los días
  $dias = $dias1;
}

// Restablecer la fecha
$fecha = null;

?>
