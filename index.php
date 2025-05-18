<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculadora de Tasa Avanzada</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
</head>
<body>
    <?php
        // Tasas iniciales BCV (se cargarán dinámicamente con JS ahora)
        // $tasa_vigente_valor_bcv = 94.32;
        // $tasa_proxima_valor_bcv = 94.76;
        // $fecha_proxima_tasa_bcv = "Lunes, 19 Mayo 2025";
    ?>

    <div class="calculator-container">
        <header class="app-header">
            <div class="logo-title">
                <span class="icon-calculator"></span> <span id="app-title-source">BCV</span> dolar
            </div>
            <div class="menu-icon" id="menu-toggle-button">☰</div>
        </header>

        <div class="dropdown-menu" id="dropdownMenu">
            <h4>Tasas de cambio</h4>
            <p class="menu-subtitle">Cambia el tipo de tasa disponible:</p>
            <button class="menu-button" data-source="BCV">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Banco_Central_de_Venezuela_logo.svg/150px-Banco_Central_de_Venezuela_logo.svg.png" alt="BCV Logo" class="menu-icon-img">
                BCV
            </button>
            <button class="menu-button" data-source="Paralelo">
                <img src="https://monitordolarvenezuela.com/img/logos/promedio.webp" alt="Paralelo Logo" class="menu-icon-img">
                Paralelo / Promedio
            </button>
            <button class="menu-button" data-source="PDVSA">
                <img src="https://logodownload.org/wp-content/uploads/2019/03/pdvsa-logo-44.png" alt="PDVSA Logo" class="menu-icon-img">
                PDVSA
            </button>
        </div>


        <div class="rates-section">
            <div class="rate-box active-rate" id="rate-box-1">
                <p id="rate-label-1">Vigente:</p>
                <p class="currency-label" id="rate-currency-1">USD$</p>
                <p class="rate-value" id="rate-value-1">0.00</p>
                <p class="rate-date" id="rate-date-1"></p>
            </div>
            <div class="rate-box" id="rate-box-2">
                <p id="rate-label-2">Próximo:</p>
                <p class="currency-label" id="rate-currency-2">USD$</p>
                <p class="rate-value" id="rate-value-2">0.00</p>
                <p class="rate-date" id="rate-date-2"></p>
            </div>
        </div>

        <div class="conversion-direction">
            <span id="fromCurrencyLabel">Dolar USD$</span>
            <button id="swap-currency" class="swap-button">⇄</button>
            <span id="toCurrencyLabel">Bolívar Bs.</span>
        </div>

        <div class="display-area">
            <input type="text" id="main-display" class="main-display-input" placeholder="0" readonly>
            <div class="calculation-result">
                <span id="input-amount-display">0.00</span>
                <i class="fa fa-angle-double-right fa-shake fa-1x fa-1x" aria-hidden="true"></i><i class="fa fa-angle-double-right fa-shake fa-1x" aria-hidden="true"></i>
                <span id="converted-amount-display">0.00</span>
                <button id="copy-result" class="copy-button" title="Copiar resultado">❐</button>
            </div>
        </div>

        <div class="keypad">
            <button class="control-button" id="clear">Limpiar</button>
            <button class="control-button" id="backspace">⌫</button>

            <button class="number-button">1</button>
            <button class="number-button">2</button>
            <button class="number-button">3</button>

            <button class="number-button">4</button>
            <button class="number-button">5</button>
            <button class="number-button">6</button>

            <button class="number-button">7</button>
            <button class="number-button">8</button>
            <button class="number-button">9</button>

            <button disabled class="control-button" id="paste"></button>
            <button class="number-button">0</button>
            <button class="number-button" id="decimal">.</button>
        </div>
    </div>

    </div> <div class="pdvsa-modal-overlay" id="pdvsaModal">
        <div class="pdvsa-modal-content">
            <button class="close-modal-button" id="closePdvsaModal">&times;</button>
            <h3 class="pdvsa-modal-title">Calendario Gasolina</h3>
            <p class="pdvsa-modal-subtitle">Terminal de Placa</p>

            <div class="plate-buttons-container">
                <button class="plate-button" data-range="1 - 2" data-offset="0">1 - 2</button>
                <button class="plate-button" data-range="3 - 4" data-offset="1">3 - 4</button>
                <button class="plate-button" data-range="5 - 6" data-offset="2">5 - 6</button>
                <button class="plate-button" data-range="7 - 8" data-offset="3">7 - 8</button>
                <button class="plate-button single-button" data-range="9 - 0" data-offset="4">9 - 0</button>
            </div>

            <div class="placa-info" id="placaInfo"> <p class="placa-label">Placa</p>
                <p class="selected-placa" id="placaDisplay"></p> </div>

            <div class="pdvsa-dates-list" id="datesDisplay">
                </div>
        </div>
    </div>

    <script src="js/app.js"></script>
</body>
</html>


            