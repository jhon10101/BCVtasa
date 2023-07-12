<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BCV Tasa</title>
    <link rel="stylesheet" href="https://bootswatch.com/5/sketchy/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">

</head>
<body style=" background-image: url('');">

<?php
  ///
?>

                        <div class="container">
                            <div class="d-flex justify-content-center">
                                <div class="px-1 col-md-6 col-12 bg-primary text-light">
                                   
                                                <div id="tasks" class="container">
                                                    
                                                    <div class="d-flex justify-content-center">
                                                    <div class="row p-2 updateTasaBCV">
                                                        <div class="col-md-4 col-9 pt-1 bg-dark rounded">
                                                            <div class="m-3"><i class="fa fa-calculator fa-2x" aria-hidden="true"></i><span class="m-2 text-warning h1 text-start">BCV dolar</span></div>
                                                        </div>
                                                        <div id="" class="col-md-1 col-3">
                                                                <a class="btn btn-lg text-warning btn-floating m-1 col-3 p-2" role="button"
                                                                        ><i class="fa fa-refresh fa-spin" aria-hidden="true"></i></a>
                                                        </div>

                                                                <div class="col-md-4 col-6 px-1 pt-2 text-center">
                                                                    <h4><div>Vigente:</div>
                                                                    <span class="m-1 p-3">USD<i class="fa fa-usd" aria-hidden="true"></i></span></h4><h1><span id="valor-vigente" class="text-center text-warning">0</span></h1>

                                                                        <span id="fecha-vigente" class="m-3 px-1"></span>
                                                                </div>
                                                            
                                                                <div class="col-md-3 col-6 px-1 pt-2 text-center text-success">
                                                                    <div>Proximo:</div>
                                                                    <span class="m-1 px-3">USD</span></br><h4><span id="valor-next" class="m-1 px-3 text-light">0</span></h4>
                                                                        
                                                                        <span id="fecha-next" class="px-1"></span>
                                                                </div>
                                                      </div>
                                                    </div>


                                                    
                                                </div>

                                </div>
                            </div>
                        </div>   
                        <div class="container">
                            <div class="d-flex justify-content-center">
                                <div class="col-md-6 col-12 bg-dark text-light rounded-bottom">
                                        <div class="row h4 p-1 align-items-center text-center">
                                            <div class="col-4 px-6 currency1">
                                                    Bolivar
                                            </div>
                                            <div class="col-4">
                                                <a class="btn btn-lg btn-outline-warning btn-floating m-1 col-12 p-1 BtnExchange" role="button"
                                                ><i class="fa fa-exchange" aria-hidden="true"></i></a>
                                            </div>
                                            <div class="col-4 px-6 currency2">
                                                    Dolar
                                            </div>
                                        </div>
                                    <form id="search" class="d-flex px-5 justify-content-center">
                                        <input disabled type="text" inputmode="decimal" step="0.01" id ="montoText" class="form-control form-control-lg me-sm-2 text-center">
                                    </form>
                                    <div class="container">
                                        <div class="row d-flex pt-2 bg-primary">
                                                <div class="col-5 px-2 text-end">
                                                    <div id="valorText" class="h3">0</div><div class="h5 m-1 currency1">Bolivar</div>
                                                </div>
                                                <div class="col-2 text-center ">
                                                <i class="fa fa-angle-double-right fa-shake fa-1x fa-2x" aria-hidden="true"></i><i class="fa fa-angle-double-right fa-shake fa-2x" aria-hidden="true"></i>
                                                </div>
                                                <div class="col-5 px-2 text-warning text-start">
                                                    <div id="valorTotal" class="h3">0</div><div class="h5 m-1 currency2">Dolar</div>
                                                </div>
                                            </div>
                                    </div>

                                    <div class="container p-2 pb-0">
                                        <div class="d-grid text-center">
                                            <!-- Section: teclado numerico -->
                                            <div class="mb-4">

                                            <!-- clear -->
                                            <button type="button" value="clear" class="btn btn-lg btn-outline-warning btn-floating m-1 col-6 p-2 Btnclear">
                                            <i class="fa-1x">Limpiar</i></button>

                                            <!-- delete -->
                                            <button type="button" value="delete" class="btn btn-lg btn-outline-warning btn-floating m-1 col-3 p-2 BtnDelete">
                                                    <i class="fa-solid fa-delete-left fa-1x"></i></button>

                                            <!-- 1 -->
                                                <button type="button" value="1" class="btn btn-lg btn-outline-warning btn-floating m-1 col-3 p-3 Btncalculator">
                                                    <i class="fa-sharp fa-light fa-1 fa-2x"></i></button>

                                            <!-- 2 -->
                                            <button type="button" value="2" class="btn btn-lg btn-outline-warning btn-floating m-1 col-3 p-3 Btncalculator">
                                                    <i class="fa-sharp fa-light fa-2 fa-2x"></i></button>

                                            <!-- 3 -->
                                            <button type="button" value="3" class="btn btn-lg btn-outline-warning btn-floating m-1 col-3 p-3 Btncalculator">
                                                    <i class="fa-sharp fa-light fa-3 fa-2x"></i></button>

                                            <!-- 4 -->
                                            <button type="button" value="4" class="btn btn-lg btn-outline-warning btn-floating m-1 col-3 p-3 Btncalculator">
                                                    <i class="fa-sharp fa-light fa-4 fa-2x"></i></button>

                                            <!-- 5 -->
                                            <button type="button" value="5" class="btn btn-lg btn-outline-warning btn-floating m-1 col-3 p-3 Btncalculator">
                                                    <i class="fa-sharp fa-light fa-5 fa-2x"></i></button>

                                            <!-- 6 -->
                                            <button type="button" value="6" class="btn btn-lg btn-outline-warning btn-floating m-1 col-3 p-3 Btncalculator">
                                                    <i class="fa-sharp fa-light fa-6 fa-2x"></i></button>

                                            <!-- 7 -->
                                            <button type="button" value="7" class="btn btn-lg btn-outline-warning btn-floating m-1 col-3 p-3 Btncalculator">
                                                    <i class="fa-sharp fa-light fa-7 fa-2x"></i></button>

                                            <!-- 8 -->
                                            <button type="button" value="8" class="btn btn-lg btn-outline-warning btn-floating m-1 col-3 p-3 Btncalculator">
                                                    <i class="fa-sharp fa-light fa-8 fa-2x"></i></button>

                                            <!-- 9 -->
                                            <button type="button" value="9" class="btn btn-lg btn-outline-warning btn-floating m-1 col-3 p-3 Btncalculator">
                                                    <i class="fa-sharp fa-light fa-9 fa-2x"></i></button>

                                            <!-- diseable -->
                                            <button disabled type="button" class="btn btn-lg btn-outline-warning btn-floating m-1 col-3 p-3">
                                                    <i class="fa-solid fa fa-2x"></i></button>

                                            <!-- 0 -->
                                            <button type="button" value="0" class="btn btn-lg btn-outline-warning btn-floating m-1 col-3 p-3 Btncalculator">
                                                    <i class="fa-sharp fa-light fa-0 fa-2x"></i></button>

                                            <!-- comma -->
                                            <button type="button" value="." class="btn btn-lg btn-outline-warning btn-floating m-1 col-3 p-2 Btncalculator">
                                                    <i class="fa-2x"><b>,</b></i></button>
                                                    


                                                
                                             
                                            </div>
                                            <!-- Section: Social media -->
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>


                


</body>
        <script src="https://code.jquery.com/jquery-3.6.3.min.js" integrity="sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script> 
        <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/js/all.min.js"></script>
        <script src="js/app.js"></script>
</html>