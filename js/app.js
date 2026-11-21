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

        // --- Elementos del Modal Personalizar / Histórico ---
        const historicModalToggle = document.getElementById('historic-modal-toggle');
        const historicModal = document.getElementById('historicModal');
        const closeHistoricModalButton = document.getElementById('closeHistoricModal');
        const calcDayBtn = document.getElementById('calcDayBtn');
        const calcDayBtnText = document.getElementById('calcDayBtnText');
        const calcDayInput = document.getElementById('calcDayInput');
        const tabDolar = document.getElementById('tabDolar');
        const tabEuro = document.getElementById('tabEuro');
        const periodSemana = document.getElementById('periodSemana');
        const periodMes = document.getElementById('periodMes');
        const startDateBox = document.getElementById('startDateBox');
        const startDateInput = document.getElementById('startDateInput');
        const startDateDisplay = document.getElementById('startDateDisplay');
        const startDateRateDisplay = document.getElementById('startDateRateDisplay');
        const endDateBox = document.getElementById('endDateBox');
        const endDateInput = document.getElementById('endDateInput');
        const endDateDisplay = document.getElementById('endDateDisplay');
        const endDateRateDisplay = document.getElementById('endDateRateDisplay');
        const historicPercentageDisplay = document.getElementById('historicPercentageDisplay');
    
    

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

    let appCurrentDateObj = null; // { iso: 'YYYY-MM-DD', display: 'DD/MM/YYYY' }
    let historicDatesModifiedByUser = false;

    function getSystemToday() {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        return { iso: `${y}-${m}-${d}`, display: `${d}/${m}/${y}` };
    }

    function parseApiDate(apiData) {
        if (!apiData) return null;
        const rawDate = apiData.DateNow || apiData.Date;
        if (rawDate && typeof rawDate === 'string') {
            const parts = rawDate.trim().split(/[-/]/);
            if (parts.length === 3) {
                if (parts[0].length === 4) {
                    const y = parts[0];
                    const m = parts[1].padStart(2, '0');
                    const d = parts[2].padStart(2, '0');
                    return { iso: `${y}-${m}-${d}`, display: `${d}/${m}/${y}` };
                } else if (parts[2].length === 4) {
                    const d = parts[0].padStart(2, '0');
                    const m = parts[1].padStart(2, '0');
                    const y = parts[2];
                    return { iso: `${y}-${m}-${d}`, display: `${d}/${m}/${y}` };
                }
            }
        }
        return null;
    }

    function getAppToday() {
        return appCurrentDateObj || getSystemToday();
    }

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
            const parsed = parseApiDate(apiData);
            if (parsed) appCurrentDateObj = parsed;
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
            const parsed = parseApiDate(apiData);
            if (parsed) appCurrentDateObj = parsed;
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
            const parsed = parseApiDate(apiData);
            if (parsed) appCurrentDateObj = parsed;
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

    // --- MANEJO DEL MODAL PERSONALIZAR / HISTÓRICO ---
    let currentHistoricSource = 'BCV'; // 'BCV' (Dolar) o 'BCVEuro' (Euro)
    // Límites de fecha dinámicos; se actualizan con la primera respuesta de la API
    let globalHistoricMinDate = '1900-01-01';
    let globalHistoricMaxDate = '2100-12-31';
    let historicRates = {
        start: null,
        end: null
    };

    function parseDateToIso(dateStr) {
        if (!dateStr) return null;
        const clean = String(dateStr).trim().replace(/[/.]/g, '-');
        const parts = clean.split('-');
        if (parts.length === 3) {
            if (parts[0].length === 4) {
                // YYYY-MM-DD
                return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
            } else if (parts[2].length === 4) {
                // DD-MM-YYYY
                return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
        }
        return null;
    }

    // Aplica los límites dinámicos de rango a los selectores de fecha
    function applyDateBounds() {
        if (!startDateInput || !endDateInput) return;

        // Fecha Inicio:
        // Mínimo permitido: fecha más antigua global de la API
        startDateInput.min = globalHistoricMinDate;
        // Máximo permitido: la fecha final actualmente seleccionada (no puede ser superior a ella)
        const currentEnd = endDateInput.value || globalHistoricMaxDate;
        startDateInput.max = currentEnd < globalHistoricMaxDate ? currentEnd : globalHistoricMaxDate;

        // Fecha Fin:
        // Mínimo permitido: la fecha inicial actualmente seleccionada (no puede ser inferior a ella)
        const currentStart = startDateInput.value || globalHistoricMinDate;
        endDateInput.min = currentStart > globalHistoricMinDate ? currentStart : globalHistoricMinDate;
        // Máximo permitido: fecha más reciente global de la API
        endDateInput.max = globalHistoricMaxDate;

        // Día Calculadora: habilitado entre la fecha más antigua y la más reciente
        if (calcDayInput) {
            calcDayInput.min = globalHistoricMinDate;
            calcDayInput.max = globalHistoricMaxDate;
        }
    }

    function formatDateToSpanishLong(isoDateStr) {
        if (!isoDateStr) return '';
        const iso = parseDateToIso(isoDateStr);
        if (!iso) return isoDateStr;
        const parts = iso.split('-').map(Number);
        if (parts.length !== 3) return isoDateStr;
        const [y, m, d] = parts;
        const dateObj = new Date(y, m - 1, d);
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const diaSemana = dias[dateObj.getDay()];
        const mes = meses[dateObj.getMonth()];
        return `${diaSemana}, ${d} ${mes} ${y}`;
    }

    function deactivatePeriodButtons() {
        if (periodSemana) periodSemana.classList.remove('active');
        if (periodMes) periodMes.classList.remove('active');
    }

    function getMondayOfWeek(isoDateStr) {
        if (!isoDateStr) return '';
        const parts = isoDateStr.split('-').map(Number);
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        const day = d.getDay(); // 0: Dom, 1: Lun, 2: Mar, ..., 6: Sáb
        const diff = (day === 0 ? 6 : day - 1);
        d.setDate(d.getDate() - diff);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dia = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${dia}`;
    }

    function updateBoundsFromApiResponse(data) {
        if (!data) return;
        if (data.MinDateIso) {
            globalHistoricMinDate = data.MinDateIso;
        } else if (data.MinDate) {
            const iso = parseDateToIso(data.MinDate);
            if (iso) globalHistoricMinDate = iso;
        }
        if (data.MaxDateIso) {
            globalHistoricMaxDate = data.MaxDateIso;
        } else if (data.MaxDate) {
            const iso = parseDateToIso(data.MaxDate);
            if (iso) globalHistoricMaxDate = iso;
        }
        applyDateBounds();
    }

    function formatIsoDateToDisplay(isoDate) {
        if (!isoDate) return '';
        const parts = isoDate.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return isoDate;
    }

    function formatHistoricRate(val) {
        if (val === null || val === undefined || isNaN(parseFloat(val))) return '--';
        return parseFloat(val).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Envía UNA sola solicitud POST a api/historic.php con startDate + endDate
    // y devuelve el objeto completo de la respuesta (o null si hubo error).
    // ─────────────────────────────────────────────────────────────────────────
    async function fetchBothDates(startDateStr, endDateStr) {
        try {
            const response = await fetch('api/historic.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startDate: startDateStr,
                    endDate:   endDateStr
                })
            });

            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            const data = await response.json();

            if (data && data.Status === 200) {
                // Actualizar los límites de rango desde DateOld / DateLast
                updateBoundsFromApiResponse(data);
                return data;
            }

            console.warn('api/historic.php devolvió Status !=200:', data);
        } catch (error) {
            console.error('Error al consultar api/historic.php:', error);
        }
        return null;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Extrae la tasa (USD o EURO) de inicio o fin según la pestaña activa
    // ─────────────────────────────────────────────────────────────────────────
    function extractRate(data, position) {
        // position: 'start' | 'end'
        if (!data) return null;
        const isEuro = currentHistoricSource === 'BCVEuro';
        if (position === 'start') {
            const val = isEuro
                ? (data.StartEURO ?? data.startEuro ?? data.StartEuro)
                : (data.StartUSD  ?? data.startUsd  ?? data.StartUsd);
            return (val !== undefined && val !== null && !isNaN(parseFloat(val)))
                ? parseFloat(val) : null;
        } else {
            const val = isEuro
                ? (data.EndEURO ?? data.endEuro ?? data.EndEuro)
                : (data.EndUSD  ?? data.endUsd  ?? data.EndUsd);
            return (val !== undefined && val !== null && !isNaN(parseFloat(val)))
                ? parseFloat(val) : null;
        }
    }

    let lastHistoricData = null;

    // ─────────────────────────────────────────────────────────────────────────
    // Muestra icono de carga en las tasas y el porcentaje
    // ─────────────────────────────────────────────────────────────────────────
    function showHistoricLoading() {
        const spinner = '<i class="fa-solid fa-spinner fa-spin"></i>';
        if (startDateRateDisplay) startDateRateDisplay.innerHTML = spinner;
        if (endDateRateDisplay) endDateRateDisplay.innerHTML = spinner;
        if (historicPercentageDisplay) {
            historicPercentageDisplay.innerHTML = spinner;
            historicPercentageDisplay.className = 'historic-percentage-display pct-zero';
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Renderiza las tasas y porcentaje a partir de los datos en memoria
    // según la pestaña seleccionada (Dolar o Euro) sin hacer petición a la API
    // ─────────────────────────────────────────────────────────────────────────
    function renderHistoricRatesFromData(data) {
        if (!data) {
            if (startDateRateDisplay) startDateRateDisplay.textContent = '--';
            if (endDateRateDisplay) endDateRateDisplay.textContent = '--';
            historicRates.start = null;
            historicRates.end = null;
            updateHistoricPercentage();
            return;
        }

        const rateStart = extractRate(data, 'start');
        const rateEnd   = extractRate(data, 'end');

        historicRates.start = rateStart;
        historicRates.end   = rateEnd;

        if (startDateRateDisplay) {
            startDateRateDisplay.textContent = formatHistoricRate(rateStart);
        }
        if (endDateRateDisplay) {
            endDateRateDisplay.textContent = formatHistoricRate(rateEnd);
        }

        updateHistoricPercentage();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Carga ambas tasas en un solo llamado y actualiza la UI completa
    // ─────────────────────────────────────────────────────────────────────────
    async function loadHistoricRates() {
        if (!startDateInput?.value || !endDateInput?.value) return;

        showHistoricLoading();

        const data = await fetchBothDates(startDateInput.value, endDateInput.value);
        lastHistoricData = data;

        renderHistoricRatesFromData(data);
    }

    function updateHistoricPercentage() {
        if (!historicPercentageDisplay) return;
        const startRate = historicRates.start;
        const endRate = historicRates.end;

        // Si alguna de las tasas no está disponible (null), mostrar estado neutro
        if (startRate === null || endRate === null || isNaN(startRate) || isNaN(endRate)) {
            historicPercentageDisplay.textContent = '-- %';
            historicPercentageDisplay.className = 'historic-percentage-display pct-zero';
            return;
        }

        if (startRate === 0 || startRate === endRate) {
            historicPercentageDisplay.textContent = '0,00 %';
            historicPercentageDisplay.className = 'historic-percentage-display pct-zero';
            return;
        }

        const pctChange = ((endRate - startRate) / startRate) * 100;
        const absFormatted = Math.abs(pctChange).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        if (endRate > startRate) {
            historicPercentageDisplay.textContent = `+ ${absFormatted} %`;
            historicPercentageDisplay.className = 'historic-percentage-display pct-positive';
        } else if (endRate < startRate) {
            historicPercentageDisplay.textContent = `- ${absFormatted} %`;
            historicPercentageDisplay.className = 'historic-percentage-display pct-negative';
        } else {
            historicPercentageDisplay.textContent = '0,00 %';
            historicPercentageDisplay.className = 'historic-percentage-display pct-zero';
        }
    }

    function openDatePicker(inputElement) {
        if (!inputElement) return;
        applyDateBounds(); // Asegurar límites actualizados antes de abrir el calendario
        if (typeof inputElement.showPicker === 'function') {
            try {
                inputElement.showPicker();
                return;
            } catch (err) {
                // Fallback si no está permitido por el contexto
            }
        }
        inputElement.focus();
        inputElement.click();
    }

    if (historicModalToggle && historicModal) {
        historicModalToggle.addEventListener('click', () => {
            historicModal.style.display = 'flex';
            deactivatePeriodButtons();
            
            // Si el usuario no ha hecho cambios previamente, cargar fecha actual en ambos cuadros
            if (!historicDatesModifiedByUser) {
                const today = getAppToday();
                let defIso = today.iso;
                if (defIso > globalHistoricMaxDate) defIso = globalHistoricMaxDate;
                if (defIso < globalHistoricMinDate) defIso = globalHistoricMinDate;
                const defDisplay = formatIsoDateToDisplay(defIso);

                if (startDateInput && startDateDisplay) {
                    startDateInput.value = defIso;
                    startDateDisplay.textContent = defDisplay;
                }
                if (endDateInput && endDateDisplay) {
                    endDateInput.value = defIso;
                    endDateDisplay.textContent = defDisplay;
                }
            }
            
            applyDateBounds();
            loadHistoricRates();
        });
    }

    if (closeHistoricModalButton && historicModal) {
        closeHistoricModalButton.addEventListener('click', () => {
            historicModal.style.display = 'none';
        });
    }

    if (calcDayBtn && calcDayInput) {
        calcDayBtn.addEventListener('click', (e) => {
            if (e.target !== calcDayInput) {
                applyDateBounds();
                openDatePicker(calcDayInput);
            }
        });

        calcDayInput.addEventListener('change', async () => {
            const selectedDate = calcDayInput.value;
            if (!selectedDate) return;

            // Asegurar límites permitidos
            let targetDate = selectedDate;
            if (targetDate < globalHistoricMinDate) {
                targetDate = globalHistoricMinDate;
                calcDayInput.value = targetDate;
            } else if (targetDate > globalHistoricMaxDate) {
                targetDate = globalHistoricMaxDate;
                calcDayInput.value = targetDate;
            }

            if (calcDayBtnText) {
                calcDayBtnText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Cargando...';
            }

            try {
                // Se envía la misma fecha como inicial y final por POST a api/historic.php
                const data = await fetchBothDates(targetDate, targetDate);

                if (data && data.Status === 200) {
                    // Se usa la tasa que esté activa en ese momento en la calculadora (Dólar o Euro)
                    const isEuro = (currentRateSource === 'BCVEuro') || (currentRatesData?.rate1?.currency === 'EUR€');
                    const rateVal = isEuro
                        ? (data.StartEURO ?? data.EndEURO ?? data.EURO ?? data.euro)
                        : (data.StartUSD ?? data.EndUSD ?? data.USD ?? data.usd);

                    if (rateVal !== undefined && rateVal !== null && !isNaN(parseFloat(rateVal))) {
                        const parsedRate = parseFloat(rateVal);

                        // 1. Cambiar "Vigente:" por "Personalizado:"
                        rateLabel1.textContent = 'Personalizado:';

                        // 2. Cambiar la tasa en la calculadora
                        rateValue1.textContent = formatHistoricRate(parsedRate);
                        rateBox1.dataset.rateValue = parsedRate;
                        activeRateValue = parsedRate;

                        // 3. Cambiar la fecha por la fecha personalizada
                        const formattedDateText = data.DateFormat || formatDateToSpanishLong(targetDate);
                        rateDate1.textContent = formattedDateText;

                        // 4. Asegurarse de que rateBox1 esté activo y rateBox2 oculto (como en la imagen)
                        rateBox2.style.display = 'none';
                        const ratesSection = document.querySelector('.rates-section');
                        if (ratesSection) {
                            ratesSection.style.justifyContent = 'center';
                        }
                        rateBox1.style.width = 'calc(100% - 20px)';
                        rateBox1.style.margin = '0 auto';
                        rateBox1.classList.add('active-rate');
                        rateBox2.classList.remove('active-rate');

                        // 5. Actualizar el objeto currentRatesData para los cálculos
                        if (!currentRatesData.rate1) {
                            currentRatesData.rate1 = {};
                        }
                        currentRatesData.rate1.value = parsedRate;
                        currentRatesData.rate1.label = 'Personalizado';
                        currentRatesData.rate1.date = formattedDateText;

                        // 6. Recalcular y actualizar pantalla de la calculadora
                        updateCalculation();
                        updateDisplayAndCalc();

                        // 7. Cerrar el modal
                        historicModal.style.display = 'none';
                    }
                }
            } catch (err) {
                console.error("Error al personalizar tasa en calculadora:", err);
            } finally {
                if (calcDayBtnText) {
                    calcDayBtnText.textContent = 'DIA CALCULADORA';
                }
            }
        });
    }

    if (historicModal) {
        historicModal.addEventListener('click', (e) => {
            if (e.target === historicModal) {
                historicModal.style.display = 'none';
            }
        });
    }

    if (startDateBox && startDateInput) {
        startDateBox.addEventListener('click', () => {
            deactivatePeriodButtons();
            openDatePicker(startDateInput);
        });

        startDateInput.addEventListener('change', async () => {
            deactivatePeriodButtons();
            historicDatesModifiedByUser = true;
            if (startDateInput.value) {
                // Validación: no permitir fecha menor al mínimo global
                if (startDateInput.value < globalHistoricMinDate) {
                    startDateInput.value = globalHistoricMinDate;
                }
                // Validación: no permitir fecha inicial superior a la fecha final seleccionada en el momento
                if (endDateInput.value && startDateInput.value > endDateInput.value) {
                    startDateInput.value = endDateInput.value;
                }

                startDateDisplay.textContent = formatIsoDateToDisplay(startDateInput.value);
                applyDateBounds();

                // Una sola llamada con ambas fechas actualizadas
                await loadHistoricRates();
            }
        });
    }

    if (endDateBox && endDateInput) {
        endDateBox.addEventListener('click', () => {
            deactivatePeriodButtons();
            openDatePicker(endDateInput);
        });

        endDateInput.addEventListener('change', async () => {
            deactivatePeriodButtons();
            historicDatesModifiedByUser = true;
            if (endDateInput.value) {
                // Validación: no permitir fecha mayor al máximo global
                if (endDateInput.value > globalHistoricMaxDate) {
                    endDateInput.value = globalHistoricMaxDate;
                }
                // Validación: no permitir fecha final inferior a la fecha inicial seleccionada
                if (startDateInput.value && endDateInput.value < startDateInput.value) {
                    endDateInput.value = startDateInput.value;
                }

                endDateDisplay.textContent = formatIsoDateToDisplay(endDateInput.value);
                applyDateBounds();

                // Una sola llamada con ambas fechas actualizadas
                await loadHistoricRates();
            }
        });
    }

    // --- Manejo de Períodos: Semana, Mes, Año ---
    async function selectPeriod(periodType) {
        deactivatePeriodButtons();

        const today = getAppToday();
        let endIso = today.iso;
        let startIso = endIso;

        if (periodType === 'semana') {
            if (periodSemana) periodSemana.classList.add('active');
            startIso = getMondayOfWeek(endIso);
        } else if (periodType === 'mes') {
            if (periodMes) periodMes.classList.add('active');
            const parts = endIso.split('-');
            startIso = `${parts[0]}-${parts[1]}-01`;
        }

        // Respetar límites globales
        if (startIso < globalHistoricMinDate) startIso = globalHistoricMinDate;
        if (endIso > globalHistoricMaxDate) endIso = globalHistoricMaxDate;
        if (startIso > endIso) startIso = endIso;

        historicDatesModifiedByUser = true;

        if (startDateInput && startDateDisplay) {
            startDateInput.value = startIso;
            startDateDisplay.textContent = formatIsoDateToDisplay(startIso);
        }
        if (endDateInput && endDateDisplay) {
            endDateInput.value = endIso;
            endDateDisplay.textContent = formatIsoDateToDisplay(endIso);
        }

        applyDateBounds();
        await loadHistoricRates();
    }

    if (periodSemana) {
        periodSemana.addEventListener('click', () => selectPeriod('semana'));
    }
    if (periodMes) {
        periodMes.addEventListener('click', () => selectPeriod('mes'));
    }

    if (tabDolar && tabEuro) {
        tabDolar.addEventListener('click', () => {
            if (currentHistoricSource === 'BCV') return;
            tabDolar.classList.add('active');
            tabEuro.classList.remove('active');
            currentHistoricSource = 'BCV';
            
            // Si ya tenemos los datos en memoria, actualizamos inmediatamente sin petición a la API
            if (lastHistoricData) {
                renderHistoricRatesFromData(lastHistoricData);
            } else {
                loadHistoricRates();
            }
        });

        tabEuro.addEventListener('click', () => {
            if (currentHistoricSource === 'BCVEuro') return;
            tabEuro.classList.add('active');
            tabDolar.classList.remove('active');
            currentHistoricSource = 'BCVEuro';
            
            // Si ya tenemos los datos en memoria, actualizamos inmediatamente sin petición a la API
            if (lastHistoricData) {
                renderHistoricRatesFromData(lastHistoricData);
            } else {
                loadHistoricRates();
            }
        });
    }

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
        //console.log(currentInput);
        if (!isCommissionMode && conversionMode === 'usd_to_bs' && currentRatesData && currentRatesData.rate1) {
            mainInputCurrencySymbol = currentRatesData.rate1.currency;
        }
        // Aseguramos que currentInput sea un número válido antes de formatear
        //const numericValue = parseFloat(currentInput) || 0;
        //const numericValue = currentInput || 0;
                if((currentInput.at(-1) == ".") || (currentInput.slice(-2) == .0)){
                    const numericValue = currentInput || 0;
                    numericValue2 = numericValue.replace('.', ',');
                   // mainDisplay.value = numericValue2 + " " + mainInputCurrencySymbol;
                } else {
                    const numericValue = parseFloat(currentInput) || 0; 
                  //  mainDisplay.value = numericValue.toLocaleString('es-VE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })   + " " + mainInputCurrencySymbol;
                  numericValue2 = numericValue.toLocaleString('es-VE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
                }  
               
              
        mainDisplay.value = numericValue2 + " " + mainInputCurrencySymbol;
        
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
                    if (commission <= 14.00) { // Aplicar mínimo de comisión
                        commission = 14.00;
                    }
                }
                finalResult = amount + commission;
            } else { // Restar comisión
                if (amount === 0) { // If amount is 0, commission should be 0
                    commission = 0;
                } else {
                    const intermediate = amount / 1.003;
                    commission = intermediate * 0.003;
                    if (commission <= 14.00) { // Aplicar mínimo de comisión
                        commission = 14.00;
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
        /*
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
            if(currentInput.at(-1) == "."){
                currentInput = currentInput.slice(0, -1);
            }
        } else{ currentInput ="0"};
        */


        //console.log(currentInput);
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
                copiedValue = textToCopy;
                // pasteButton.disabled = false; // Ya no es necesario, el botón siempre estará activo
                convertedAmountDisplay.textContent = "Copiando";
                setTimeout(() => {
                    convertedAmountDisplay.textContent = originalText;
                }, 1300);
            })
            .catch(err => {
                console.error('Error al copiar:', err);
                convertedAmountDisplay.textContent = "Error al copiar";
                setTimeout(() => {
                    convertedAmountDisplay.textContent = originalText;
                }, 1300);
            });
    });

    pasteButton.addEventListener('click', async () => {
        try {
            // Intenta leer del portapapeles del sistema (puede fallar en algunos WebViews de Android)
            const text = await navigator.clipboard.readText();
            const cleanedText = text.trim().replace(/[^0-9,.]/g, '').replace(',', '.');

            if (cleanedText && !isNaN(parseFloat(cleanedText))) {
                currentInput = cleanedText;
                updateDisplayAndCalc(); // Llama a la función para refrescar la pantalla
                return; // Si tiene éxito, termina la función aquí.
            }
        } catch (err) {
            console.error('Error al pegar desde el portapapeles:', err);
            // Si falla la API moderna (común en Android), usamos el valor copiado internamente como respaldo.
            if (copiedValue) {
                currentInput = copiedValue;
                updateDisplayAndCalc();
            }
        }
    });

    // --- INICIALIZACIÓN ---
    async function initializeApp() {
        pdvsaModal.style.display = 'none';
        if (historicModal) {
            historicModal.style.display = 'none';
            deactivatePeriodButtons();
            const today = getAppToday();
            let defIso = today.iso;
            if (defIso > globalHistoricMaxDate) defIso = globalHistoricMaxDate;
            if (defIso < globalHistoricMinDate) defIso = globalHistoricMinDate;
            const defDisplay = formatIsoDateToDisplay(defIso);

            if (startDateInput && startDateDisplay) {
                startDateInput.value = defIso;
                startDateDisplay.textContent = defDisplay;
            }
            if (endDateInput && endDateDisplay) {
                endDateInput.value = defIso;
                endDateDisplay.textContent = defDisplay;
            }
            applyDateBounds();
            updateHistoricPercentage();
        }
        const initialRates = await fetchBCVRates();
        if (initialRates) {
            appTitleSource.textContent = "Dolar BCV";
            conversionMode = 'usd_to_bs'; // Resetear modo
            exitCommissionMode(); // Asegurarse de no estar en modo comisión
            updateRateDisplay(initialRates); // Carga la UI normal

            // Si se cargó la fecha desde la API y el usuario no la ha modificado, sincronizar
            if (!historicDatesModifiedByUser) {
                const today = getAppToday();
                let defIso = today.iso;
                if (defIso > globalHistoricMaxDate) defIso = globalHistoricMaxDate;
                if (defIso < globalHistoricMinDate) defIso = globalHistoricMinDate;
                const defDisplay = formatIsoDateToDisplay(defIso);

                if (startDateInput && startDateDisplay) {
                    startDateInput.value = defIso;
                    startDateDisplay.textContent = defDisplay;
                }
                if (endDateInput && endDateDisplay) {
                    endDateInput.value = defIso;
                    endDateDisplay.textContent = defDisplay;
                }
                applyDateBounds();
            }
        }
        updateDisplayAndCalc();
        // pasteButton.disabled = true; // Ya no es necesario
    }

    initializeApp();
});

fromCurrencyLabel.classList.add('commission-active-font');
toCurrencyLabel.classList.add('commission-active-font');