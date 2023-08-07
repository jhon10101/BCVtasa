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

<div class="offcanvas offcanvas-start bg-primary text-warning" data-bs-dismiss="offcanvas" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title h1" id="offcanvasExampleLabel">Tasas de cambio</h5>
    <button type="button" class="btn-close text-reset h1" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body h2  text-light">
    <div class="mb-4">
      Cambia el tipo de tasa disponible:
    </div>
        <div class="bg-primary"> <!-- container -->
            <div class="d-flex justify-content-center">
                <div class="col-md-12 col-12 text-light">
                        <div id="" class="container">
                            <div class="justify-content-center">
                              <div value="BCV" class="col-12 my-3 p-3 px-5 btn btn-warning btn-lg text-primary fs-1 exchange-source">
                                <img src="https://exchangemonitor.net/img/ve/nacional/bcv.webp" alt="BCV" width="20%" height="20%" class="float-start">
                                    <span class="align-middle fw-bold">BCV</span>
                              </div>
                              <div value="Paralelo" class="col-12 my-3 p-3 px-5 btn btn-warning btn-lg text-primary fs-1 exchange-source">
                              <img src="https://exchangemonitor.net/img/ve/monitor-dolar.webp" alt="BCV" width="20%" height="20%" class="float-start">
                                    <span class="align-middle fw-bold">Paralelo</span>
                              </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    </div>
</div>
                        <div class=""> <!-- container -->
                            <div class="d-flex justify-content-center">
                                <div class="col-md-6 col-12 bg-primary text-light">
                                   
                                                <div id="tasks" class="container">
                                                    
                                                    <div class="d-flex justify-content-center">
                                                    <div class="row px-1 pb-1">

                                                        <div class="col-md-9 col-9 pt-1 bg-dark rounded"  role="button" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">
                                                            <div class="m-3"><i class="fa fa-calculator fa-shake fa-2x mx-3" aria-hidden="true"></i><span class="m-1 text-warning h2 text-start"><span id="sourceTasa"></span> dolar</span></div>
                                                        </div>
                                                        <div id="" class="col-md-3 col-3">
                                                                <a class="btn btn-lg text-warning btn-floating m-1 col-3 p-2" role="button" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample"
                                                                        ><i class="fa fa-bars fa-2x" aria-hidden="true"></i></a>
                                                        </div>
                                                                <div id="vigente" class="col-6 px-1 pt-2 text-center updateTasaBCV">
                                                                    <h4><div>Vigente:</div>
                                                                    <span class="m-1 p-3">USD<i class="fa fa-usd" aria-hidden="true"></i></span></h4><span id="valor-vigente" class="h1 text-center text-warning fw-bold fs-1">0</span>
                                                                    <br>
                                                                        <span id="source-paralelo" class="px-1 text-light fs-3"></span>
                                                                </div>
                                                            
                                                                <div id="proximo" class="col-6 px-1 pt-1 text-center text-success updateTasaBCV">
                                                                    <div>Proximo:</div>
                                                                    <span class="m-1 px-3">USD</span><br><span id="valor-next" class="h4 m-1 px-3 text-light">0</span>
                                                                    <br>
                                                                        <span id="fecha-next" class="px-1"></span>
                                                                </div>
                                                      </div>
                                                    </div>


                                                    
                                                </div>

                                </div>
                            </div>
                        </div>   
                        <div class=""> 
                            <div class="d-flex justify-content-center">
                                <div class="col-md-6 col-12 bg-dark text-light">
                                        <div class="row align-items-center text-center">
                                            <div class="col-4 px-6 h4 currency1">
                                                    Dolar $
                                            </div>
                                            <div class="col-4">
                                                <a class="btn btn-lg btn-outline-warning btn-floating m-1 col-12 p-1 BtnExchange" data-toggle="tooltip" data-placement="top" data-original-title="Cambiar Moneda" role="button"
                                                ><i class="fa fa-exchange" aria-hidden="true"></i></a>
                                            </div>
                                            <div class="col-4 px-6 h4 currency2">
                                                    Bolivar Bs.
                                            </div>
                                        </div>
                                    <form id="search" class="d-flex px-5 justify-content-center">
                                        <input disabled type="text" inputmode="decimal" step="0.01" id ="montoText" class="form-control form-control-lg me-sm-2 text-center target">
                                    </form>
                                    <div class="container">
                                        <div class="row d-flex pt-1 bg-primary">
                                                <div class="col-5 px-2 text-end">
                                                    <div id="valorText" class="h3">0</div><div class="h5 m-1 currency1">Dolar</div>
                                                </div>
                                                <div class="col-2 text-center ">
                                                <i class="fa fa-angle-double-right fa-shake fa-1x fa-2x" aria-hidden="true"></i><i class="fa fa-angle-double-right fa-shake fa-2x" aria-hidden="true"></i>
                                                </div>
                                                <div class="col-4 px-2 text-warning text-start copiado" data-clipboard-target="#valorTotal">
                                                    <div id="valorTotal" class="h3">0</div><div class="h5 m-1 currency2">Bolivar</div>
                                                </div><div class="col-1 p-0 align-middle copiado"  data-clipboard-target="#valorTotal"><i class="fa-solid fa-copy fa-lg"></i></div>
                                            </div>
                                    </div>

                                    <div class="container bg-primary h-100 p-0 pb-0">
                                        <div class="d-grid text-center">
                                            <!-- Section: teclado numerico -->
                                            <div class="mb-2">

                                            <!-- clear -->
                                            <button type="button" value="clear" class="btn btn-lg btn-outline-warning btn-floating m-0 col-6 p-2 Btnclear">
                                            <i class="fa-1x">Limpiar</i></button>

                                            <!-- delete -->
                                            <button type="button" value="delete" class="btn btn-lg btn-outline-warning btn-floating m-1 col-3 p-2 BtnDelete">
                                                    <i class="fa-solid fa-delete-left fa-1x"></i></button>

                                            <!-- 1 -->
                                                <button type="button" value="1" class="btn btn-lg btn-outline-warning btn-floating m-0 col-3 px-3 Btncalculator">
                                                    <i class="fa-sharp fa-light fa-1 fa-2x"></i></button>

                                            <!-- 2 -->
                                            <button type="button" value="2" class="btn btn-lg btn-outline-warning btn-floating m-0 col-3 px-3 Btncalculator">
                                                    <i class="fa-sharp fa-light fa-2 fa-2x"></i></button>

                                            <!-- 3 -->
                                            <button type="button" value="3" class="btn btn-lg btn-outline-warning btn-floating m-0 col-3 px-3 Btncalculator">
                                                    <i class="fa-sharp fa-light fa-3 fa-2x"></i></button>

                                            <!-- 4 -->
                                            <button type="button" value="4" class="btn btn-lg btn-outline-warning btn-floating m-0 col-3 px-3 Btncalculator">
                                                    <i class="fa-sharp fa-light fa-4 fa-2x"></i></button>

                                            <!-- 5 -->
                                            <button type="button" value="5" class="btn btn-lg btn-outline-warning btn-floating m-0 col-3 px-3 Btncalculator">
                                                    <i class="fa-sharp fa-light fa-5 fa-2x"></i></button>

                                            <!-- 6 -->
                                            <button type="button" value="6" class="btn btn-lg btn-outline-warning btn-floating m-0 col-3 px-3 Btncalculator">
                                                    <i class="fa-sharp fa-light fa-6 fa-2x"></i></button>

                                            <!-- 7 -->
                                            <button type="button" value="7" class="btn btn-lg btn-outline-warning btn-floating m-0 col-3 px-3 Btncalculator">
                                                    <i class="fa-sharp fa-light fa-7 fa-2x"></i></button>

                                            <!-- 8 -->
                                            <button type="button" value="8" class="btn btn-lg btn-outline-warning btn-floating m-0 col-3 px-3 Btncalculator">
                                                    <i class="fa-sharp fa-light fa-8 fa-2x"></i></button>

                                            <!-- 9 -->
                                            <button type="button" value="9" class="btn btn-lg btn-outline-warning btn-floating m-0 col-3 px-3 Btncalculator">
                                                    <i class="fa-sharp fa-light fa-9 fa-2x"></i></button>

                                            <!-- Pegar -->
                                            <button type="button" class="btn btn-lg btn-outline-warning btn-floating m-0 col-3 px-3 py-0 pegar">
                                                    <i class="fa-thin fa-paste fa"></i><div>Pegar</div></button>

                                            <!-- 0 -->
                                            <button type="button" value="0" class="btn btn-lg btn-outline-warning btn-floating m-0 col-3 px-3 Btncalculator">
                                                    <i class="fa-sharp fa-light fa-0 fa-2x"></i></button>

                                            <!-- comma -->
                                            <button type="button" value="." class="btn btn-lg btn-outline-warning btn-floating m-0 col-3 py-0 Btncalculator">
                                                    <i class="fa-2x">,</i></button>
                                                    


                                                
                                             
                                            </div>
                                            <!-- Section: Social media -->
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>


                


</body>
        <script src="https://code.jquery.com/jquery-3.6.3.min.js" integrity="sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/js/all.min.js"></script>
        <script src="js/app.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.11/clipboard.min.js" integrity="sha512-7O5pXpc0oCRrxk8RUfDYFgn0nO1t+jLuIOQdOMRp4APB7uZ4vSjspzp5y6YDtDs4VzUSTbWzBFZ/LKJhnyFOKw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
</html>