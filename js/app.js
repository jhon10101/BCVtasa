document.addEventListener('DOMContentLoaded', function() {
    // Elementos de la UI
    const mainDisplay = document.getElementById('main-display');
    const inputAmountDisplay = document.getElementById('input-amount-display');
    const convertedAmountDisplay = document.getElementById('converted-amount-display');

    const rateBox1 = document.getElementById('rate-box-1');
    const rateLabel1 = document.getElementById('rate-label-1');
    const rateCurrency1 = document.getElementById('rate-currency-1');
    const rateValue1 = document.getElementById('rate-value-1');
    const rateDate1 = document.getElementById('rate-date-1');

    const rateBox2 = document.getElementById('rate-box-2');
    const rateLabel2 = document.getElementById('rate-label-2');
    const rateCurrency2 = document.getElementById('rate-currency-2');
    const rateValue2 = document.getElementById('rate-value-2');
    const rateDate2 = document.getElementById('rate-date-2');

    const swapButton = document.getElementById('swap-currency');
    const fromCurrencyLabel = document.getElementById('fromCurrencyLabel');
    const toCurrencyLabel = document.getElementById('toCurrencyLabel');
    const appTitleSource = document.getElementById('app-title-source');

    const numberButtons = document.querySelectorAll('.number-button');
    const clearButton = document.getElementById('clear');
    const backspaceButton = document.getElementById('backspace');
    const pasteButton = document.getElementById('paste');
    const copyResultButton = document.getElementById('copy-result');


    const themeToggleButton = document.getElementById('theme-toggle'); // Obtener el nuevo botón

            // --- Lógica del Tema Claro/Oscuro ---
    const currentTheme = localStorage.getItem('theme'); // Obtener el tema guardado
    if (currentTheme) {
        document.body.classList.add(currentTheme); // Aplicar el tema guardado
        // Actualizar el icono del botón según el tema actual
        if (currentTheme === 'light-theme') {
            themeToggleButton.textContent = '☀️'; // Si es claro, muestra sol
        } else {
            themeToggleButton.textContent = '🌙'; // Si es oscuro, muestra luna
        }
    } else {
        // Si no hay tema guardado, se asume el tema oscuro por defecto (tu CSS actual)
        localStorage.setItem('theme', ''); // Guarda vacío o 'dark-theme' explícitamente
        themeToggleButton.textContent = '🌙';
    }


    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            document.body.classList.toggle('light-theme'); // Alternar la clase 'light-theme'
            let theme = 'dark-theme'; // Tema por defecto (el actual si no tiene light-theme)
            if (document.body.classList.contains('light-theme')) {
                theme = 'light-theme';
                themeToggleButton.textContent = '☀️'; // Cambiar icono a sol
            } else {
                theme = 'dark-theme';
                themeToggleButton.textContent = '🌙'; // Cambiar icono a luna
            }
            localStorage.setItem('theme', theme); // Guardar la preferencia
        });
    }



        // --- Nuevos elementos del Modal PDVSA ---
        const pdvsaModal = document.getElementById('pdvsaModal');
        const closePdvsaModalButton = document.getElementById('closePdvsaModal');
        const plateButtons = document.querySelectorAll('.plate-button'); // Todos los botones de placa
        const placaDisplay = document.getElementById('placaDisplay'); // Donde se muestra el rango de placa seleccionado
        const datesDisplay = document.getElementById('datesDisplay'); // Donde se muestra la lista de fechas
        const placaInfoSection = document.getElementById('placaInfo'); // La sección que contiene "Placa" y el rango
    
    

    // Elementos del Menú
    const menuToggleButton = document.getElementById('menu-toggle-button');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const menuButtons = document.querySelectorAll('.menu-button'); // Botones BCV, Paralelo, PDVSA

    // Función para cerrar el menú
    function closeDropdownMenu() {
        dropdownMenu.classList.remove('show');
    }

    // Función para abrir el menú
    function openDropdownMenu() {
        dropdownMenu.classList.add('show');
        if (!document.getElementById('closeMenuBtn')) {
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&times;';
            closeBtn.id = 'closeMenuBtn';
            closeBtn.className = 'close-menu-button';
            closeBtn.setAttribute('aria-label', 'Cerrar menú');
            closeBtn.onclick = closeDropdownMenu;
            dropdownMenu.prepend(closeBtn);
        }
    }

    // Estado de la aplicación
    let currentInput = "0";
    let activeRateValue = 0;
    let currentRateSource = 'BCV';
    let conversionMode = 'usd_to_bs';
    let currentRatesData = {};
    let isCommissionMode = false; // <-- NUEVO: Estado para el modo comisión
    let copiedValue = null; // Para almacenar el valor copiado

    // --- Lógica del modo Comisión ---

    function enterCommissionMode() {
        isCommissionMode = true;

        // 1. Cambiar título
        appTitleSource.textContent = "Pago Móvil BCV";

        // 2. Cambiar cajas de tasas a botones de comisión
        rateLabel1.textContent = "SUMAR";
        rateCurrency1.textContent = '(Monto + Comisión)';
        rateValue1.textContent = '';
        rateDate1.textContent = '';
        
        rateLabel2.textContent = "RESTAR";
        rateCurrency2.textContent = '(Monto - Comisión)';
        rateValue2.textContent = '';
        rateDate2.textContent = '';

        // Asegurarse que ambas cajas estén visibles y con estilo de botón
        rateBox1.style.display = 'flex';
        rateBox2.style.display = 'flex';
        const ratesSection = document.querySelector('.rates-section');
        ratesSection.style.justifyContent = 'space-between';
        rateBox1.style.flex = '1';
        rateBox2.style.flex = '1';
        rateBox1.style.width = '';
        rateBox1.style.margin = '';
        
        // Seleccionar "Sumar comisión" por defecto
        rateBox1.classList.add('active-rate');
        rateBox2.classList.remove('active-rate');

        // 3. Ocultar botón de swap y cambiar etiquetas
        swapButton.style.display = 'none';
        fromCurrencyLabel.textContent = 'Comisión';
        toCurrencyLabel.textContent = '0,00 Bs.';

        // 4. Forzar modo de conversión a uno que no afecte (usaremos bs_to_usd para que el input sea Bs)
        conversionMode = 'bs_to_usd'; 

        updateDisplayAndCalc();
    }

    function exitCommissionMode() {
        isCommissionMode = false;
        swapButton.style.display = 'block'; // Mostrar botón de swap
    }


    // --- SIMULACIÓN DE API Y CONSUMO REAL ---

    async function fetchBCVRates() {
        source = 'BCV';
        const dataToSend = { source: source };
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        };
        const response = await fetch('api/data.php', options);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const apiData = await response.json();

        if (apiData && apiData.Status === 200) {
            return {
                sourceName: apiData.Source,
                rate1: { label: "Vigente", currency: "USD$", value: apiData.USD, date: apiData.DateFormat },
                rate2: { label: "Próximo", currency: "USD$", value: apiData.USDNext, date: apiData.DateFormatNext }
            };
        } else {
            console.error("Error en API BCV:", apiData);
            return {
                sourceName: "BCV",
                rate1: { label: "Vigente", currency: "USD$", value: 0, date: "Error" },
                rate2: { label: "Próximo", currency: "USD$", value: 0, date: "Error" }
            };
        }
    }

    async function fetchBCVEuroRates() {
        source = 'BCVEuro';
        const dataToSend = { source: source };
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        };
        const response = await fetch('api/data.php', options);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const apiData = await response.json();

        if (apiData && apiData.Status === 200) {
            return {
                sourceName: apiData.Source,
                rate1: { label: "Vigente", currency: "EUR€", value: apiData.EURO, date: apiData.DateFormat },
                rate2: { label: "Próximo", currency: "EUR€", value: apiData.EURONext, date: apiData.DateFormatNext }
            };
        } else {
            console.error("Error en API BCV Euro:", apiData);
            return {
                sourceName: "BCVEuro",
                rate1: { label: "Vigente", currency: "EUR€", value: 0, date: "Error" },
                rate2: { label: "Próximo", currency: "EUR€", value: 0, date: "Error" }
            };
        }
    }

    async function fetchParaleloRates() {
        source = 'Paralelo';
        const dataToSend = { source: source };
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        };
        const response = await fetch('api/data.php', options);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const apiData = await response.json();

        if (apiData && apiData.Status === 200) {
            return {
                sourceName: apiData.Source,
                rate1: { label: "Paralelo", currency: "USD$", value: apiData.USD, date: apiData.DateFormat },
                rate2: { label: "Promedio", currency: "USD$", value: apiData.USDNext, date: apiData.DateFormatNext }
            };
        } else {
            console.error("Error en API Paralelo:", apiData);
            return {
                sourceName: "Paralelo",
                rate1: { label: "Paralelo", currency: "USD$", value: 0, date: "Error" },
                rate2: { label: "Promedio", currency: "USD$", value: 0, date: "Error" }
            };
        }
    }

    // --- MANEJO DEL MENÚ ---
    menuToggleButton.addEventListener('click', () => {
        if (dropdownMenu.classList.contains('show')) {
            closeDropdownMenu();
        } else {
            openDropdownMenu();
        }
    });

    menuButtons.forEach(button => {
        button.addEventListener('click', async () => {
            currentRateSource = button.dataset.source;
            closeDropdownMenu();

            if (currentRateSource === 'PagoMovil') {
                enterCommissionMode();
            } else if (currentRateSource === 'PDVSA') {
                if (isCommissionMode) exitCommissionMode(); // Salir del modo comisión si estaba activo
                pdvsaModal.style.display = 'flex';
                placaInfoSection.style.display = 'none';
                placaDisplay.textContent = '';
                datesDisplay.innerHTML = '';
                datesDisplay.style.display = 'none';
            } else {
                if (isCommissionMode) exitCommissionMode(); // Salir del modo comisión si estaba activo
                
                let ratesData;
                if (currentRateSource === 'BCV') {
                    appTitleSource.textContent = "Dolar BCV";
                    ratesData = await fetchBCVRates();
                } else if (currentRateSource === 'BCVEuro') {
                    appTitleSource.textContent = "Euro BCV";
                    ratesData = await fetchBCVEuroRates();
                } else if (currentRateSource === 'Paralelo') {
                    appTitleSource.textContent = "Dolar Paralelo";
                    ratesData = await fetchParaleloRates();
                }

                if (ratesData) {
                    updateRateDisplay(ratesData);
                }
            }
        });
    });

    // --- MANEJO DEL MODAL PDVSA ---
    closePdvsaModalButton.addEventListener('click', () => {
        pdvsaModal.style.display = 'none';
    });
    
    // (El resto del código de PDVSA permanece igual)
    plateButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const plateRange = button.dataset.range;
            const plateOffset = parseInt(button.dataset.offset);
            placaDisplay.textContent = `Placa ${plateRange}`;
            placaInfoSection.style.display = 'block';
            datesDisplay.innerHTML = '<p>Cargando calendario...</p>';
            datesDisplay.style.display = 'block';

            try {
                const response = await fetch('api/data.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ source: 'PDVSA', plateOffset: plateOffset })
                });
                if (!response.ok) throw new Error(`Error en la petición: ${response.status}`);
                const data = await response.json();
                if (data && data.Status === 200 && data.Dates) {
                    let datesHtml = '';
                    data.Dates.forEach(dateString => { datesHtml += `<p>${dateString}</p>`; });
                    datesDisplay.innerHTML = datesHtml;
                } else {
                    datesDisplay.innerHTML = '<p>Error al cargar el calendario.</p>';
                }
            } catch (error) {
                console.error("Error en fetch de PDVSA:", error);
                datesDisplay.innerHTML = '<p>Error de conexión.</p>';
            }
        });
    });

    // --- ACTUALIZACIÓN DE TASAS EN LA UI (MODO NORMAL) ---
    function updateRateDisplay(data) {
        currentRatesData = data;

        rateLabel1.textContent = data.rate1.label + ':';
        rateCurrency1.textContent = data.rate1.currency;
        rateValue1.textContent = parseFloat(data.rate1.value).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        rateDate1.textContent = data.rate1.date || "";
        rateBox1.dataset.rateValue = data.rate1.value;

        if (data.rate2 && data.rate2.value !== undefined && data.rate2.date !== undefined) {
            rateLabel2.textContent = data.rate2.label + ':';
            rateCurrency2.textContent = data.rate2.currency;
            rateValue2.textContent = parseFloat(data.rate2.value).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            rateDate2.textContent = data.rate2.date;
            rateBox2.dataset.rateValue = data.rate2.value;
        } else {
            rateLabel2.textContent = 'Próximo:';
            rateCurrency2.textContent = 'USD$';
            rateValue2.textContent = '0.00';
            rateDate2.textContent = '';
            rateBox2.dataset.rateValue = '0';
        }

        const ratesSection = document.querySelector('.rates-section');
        const datesAreSame = data.rate1.date && data.rate2 && data.rate2.date && data.rate1.date === data.rate2.date;
        const rate2DataMissingOrZero = !data.rate2 || !data.rate2.date || parseFloat(data.rate2.value) === 0;

        if ((currentRateSource === 'BCV' || currentRateSource === 'BCVEuro') && (datesAreSame || rate2DataMissingOrZero)) {
            rateBox2.style.display = 'none';
            ratesSection.style.justifyContent = 'center';
            rateBox1.style.width = 'calc(100% - 20px)';
            rateBox1.style.margin = '0 auto';
        } else {
            rateBox2.style.display = 'flex';
            ratesSection.style.justifyContent = 'space-between';
            rateBox1.style.width = '';
            rateBox1.style.margin = '';
        }

        rateBox1.classList.add('active-rate');
        rateBox2.classList.remove('active-rate');
        activeRateValue = parseFloat(data.rate1.value);
        
        updateCurrencyLabels();
        updateCalculation();
        updateDisplayAndCalc();
    }
    
    function updateCurrencyLabels() {
        if (isCommissionMode) return; // No hacer nada en modo comisión
        let currencylabel = (currentRatesData.rate1.currency === "USD$") ? "Dolar " : "Euro ";
        if (conversionMode === 'usd_to_bs') {
            fromCurrencyLabel.textContent = currencylabel + currentRatesData.rate1.currency;
            toCurrencyLabel.textContent = 'Bolívar Bs.';
        } else {
            fromCurrencyLabel.textContent = 'Bolívar Bs.';
            toCurrencyLabel.textContent = currencylabel + currentRatesData.rate1.currency;
        }
    }


    // Event listeners para seleccionar tasa/comisión
    rateBox1.addEventListener('click', () => {
        if (!isCommissionMode && currentRatesData && currentRatesData.rate1) {
            activeRateValue = parseFloat(currentRatesData.rate1.value);
        }
        rateBox1.classList.add('active-rate');
        rateBox2.classList.remove('active-rate');
        updateCalculation();
    });

    rateBox2.addEventListener('click', () => {
        if (!isCommissionMode && currentRatesData && currentRatesData.rate2) {
            activeRateValue = parseFloat(currentRatesData.rate2.value);
        }
        rateBox2.classList.add('active-rate');
        rateBox1.classList.remove('active-rate');
        updateCalculation();
    });


    // --- LÓGICA DE LA CALCULADORA ---
    swapButton.addEventListener('click', () => {
        if (isCommissionMode) return;
        conversionMode = (conversionMode === 'usd_to_bs') ? 'bs_to_usd' : 'usd_to_bs';
        updateCurrencyLabels();
        updateDisplayAndCalc();
    });

    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            const number = button.textContent;

            if (number === '.') {
                if (!currentInput.includes('.')) {
                    currentInput += '.';
                }
                // Si ya hay un punto, no hacer nada.
                updateDisplayAndCalc();
                return;
            }

            if (currentInput.includes('.')) {
                const parts = currentInput.split('.');
                if (parts[1].length < 2) {
                    currentInput += number; // Añadir si hay 0 o 1 decimal
                } else if (parts[1].length === 2 && parts[1].endsWith('0')) {
                    // Si hay 2 decimales y el último es 0, reemplazarlo
                    currentInput = currentInput.slice(0, -1) + number;
                }
                // Si ya hay 2 decimales y el último no es 0, no hacer nada.
            } else {
                // Lógica para la parte entera
                currentInput = (currentInput === "0") ? number : currentInput + number;
            }
            updateDisplayAndCalc();
        });
    });

    function updateDisplayAndCalc() {
        let mainInputCurrencySymbol = 'Bs.';
        if (!isCommissionMode && conversionMode === 'usd_to_bs' && currentRatesData && currentRatesData.rate1) {
            mainInputCurrencySymbol = currentRatesData.rate1.currency;
        }
        // Aseguramos que currentInput sea un número válido antes de formatear
        const numericValue = parseFloat(currentInput) || 0;
        mainDisplay.value = numericValue.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " " + mainInputCurrencySymbol;
        inputAmountDisplay.textContent = '';
        updateCalculation();
    }

    function updateCalculation() {
        const amount = parseFloat(currentInput) || 0;

        if (isCommissionMode) {
            let commission = 0;
            let finalResult = 0;
            const isAdding = rateBox1.classList.contains('active-rate');

            if (isAdding) { // Sumar comisión
                if (amount === 0) { // If amount is 0, commission should be 0
                    commission = 0;
                } else {
                    commission = amount * 0.003;
                    if (commission <= 2.00) { // Aplicar mínimo de comisión
                        commission = 2.00;
                    }
                }
                finalResult = amount + commission;
            } else { // Restar comisión
                if (amount === 0) { // If amount is 0, commission should be 0
                    commission = 0;
                } else {
                    const intermediate = amount / 1.003;
                    commission = intermediate * 0.003;
                    if (commission <= 2.00) { // Aplicar mínimo de comisión
                        commission = 2.00;
                    }
                }
                finalResult = amount - commission;
            }

            toCurrencyLabel.textContent = commission.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' Bs.';
            convertedAmountDisplay.textContent = finalResult.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' Bs.';
            return;
        }

        // --- Lógica original de tasas ---
        if (isNaN(amount) || !activeRateValue || activeRateValue === 0) {
            const defaultSymbol = (conversionMode === 'usd_to_bs') ? 'Bs.' : (currentRatesData.rate1.currency || '$');
            convertedAmountDisplay.textContent = `0,00 ${defaultSymbol}`;
            return;
        }

        let result;
        let outputCurrencySymbol = '';
        if (conversionMode === 'usd_to_bs') {
            result = amount * activeRateValue;
            outputCurrencySymbol = 'Bs.';
        } else {
            result = amount / activeRateValue;
            outputCurrencySymbol = currentRatesData.rate1.currency || '$';
        }
        convertedAmountDisplay.textContent = result.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ` ${outputCurrencySymbol}`;
    }

    clearButton.addEventListener('click', () => {
        currentInput = "0";
        updateDisplayAndCalc();
    });

    backspaceButton.addEventListener('click', () => {
        currentInput = (currentInput.length > 1) ? currentInput.slice(0, -1) : "0";
        updateDisplayAndCalc();
    });
    
    copyResultButton.addEventListener('click', () => {
        const originalText = convertedAmountDisplay.textContent;
        const fullText = originalText;
        const lastSpaceIndex = fullText.lastIndexOf(' ');
        let textToCopy = (lastSpaceIndex !== -1) ? fullText.substring(0, lastSpaceIndex) : fullText;
        let textToCopy2 = (lastSpaceIndex !== -1) ? fullText.substring(0, lastSpaceIndex) : fullText;
        textToCopy = textToCopy.replace(/\./g, '').replace(',', '.');
        textToCopy2 = textToCopy2.replace(/\./g, '').replace('.', ',');
        navigator.clipboard.writeText(textToCopy2)
            .then(() => {
                copiedValue = textToCopy2;
                // pasteButton.disabled = false; // Ya no es necesario, el botón siempre estará activo
                convertedAmountDisplay.textContent = "Copiando";
                setTimeout(() => {
                    convertedAmountDisplay.textContent = originalText;
                }, 1500);
            })
            .catch(err => {
                console.error('Error al copiar:', err);
                convertedAmountDisplay.textContent = "Error al copiar";
                setTimeout(() => {
                    convertedAmountDisplay.textContent = originalText;
                }, 1500);
            });
    });

    pasteButton.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            // Limpia el texto: quita espacios, letras (excepto , y .) y luego reemplaza la coma por punto.
            const cleanedText = text.trim().replace(/[^0-9,.]/g, '').replace(',', '.');
            if (cleanedText && !isNaN(parseFloat(cleanedText))) {
                currentInput = cleanedText;
                updateDisplayAndCalc(); // Llama a la función para refrescar la pantalla
            };
            if (copiedValue && !isNaN(parseFloat(copiedValue))) {
                currentInput = copiedValue;
                updateDisplayAndCalc(); // Llama a la función para refrescar la pantalla {
                
            }; 
        } catch (err) {
            console.error('Error al pegar desde el portapapeles:', err);
        }
    });

    // --- INICIALIZACIÓN ---
    async function initializeApp() {
        pdvsaModal.style.display = 'none';
        const initialRates = await fetchBCVRates();
        if (initialRates) {
            appTitleSource.textContent = "Dolar BCV";
            conversionMode = 'usd_to_bs'; // Resetear modo
            exitCommissionMode(); // Asegurarse de no estar en modo comisión
            updateRateDisplay(initialRates); // Carga la UI normal
        }
        updateDisplayAndCalc();
        // pasteButton.disabled = true; // Ya no es necesario
    }

    initializeApp();
});

fromCurrencyLabel.classList.add('commission-active-font');
toCurrencyLabel.classList.add('commission-active-font');