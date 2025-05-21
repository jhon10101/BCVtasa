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
        // Opcional: eliminar el botón 'X' al cerrar el menú principal si fue añadido dinámicamente
        // const closeBtn = document.getElementById('closeMenuBtn');
        // if (closeBtn) {
        //     closeBtn.remove();
        // }
    }

    // Función para abrir el menú
    function openDropdownMenu() {
        dropdownMenu.classList.add('show');
        // Añadir el botón 'X' si aún no existe
        if (!document.getElementById('closeMenuBtn')) {
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&times;'; // Caracter 'X'
            closeBtn.id = 'closeMenuBtn';
            closeBtn.className = 'close-menu-button';
            closeBtn.setAttribute('aria-label', 'Cerrar menú'); // Para accesibilidad
            closeBtn.onclick = closeDropdownMenu; // Asignar la función de cierre
            dropdownMenu.prepend(closeBtn); // Añade el botón X al inicio del menú (arriba)
        }
    }


/*
    menuButtons.forEach(button => {
        button.addEventListener('click', async () => {
            currentRateSource = button.dataset.source;

            let ratesData;
            if (currentRateSource === 'BCV') {
                appTitleSource.textContent = currentRateSource;
                ratesData = await fetchBCVRates();
            } else if (currentRateSource === 'Paralelo') {
                appTitleSource.textContent = currentRateSource;
                ratesData = await fetchParaleloRates();
            }
            
            if (ratesData) { // Asegurarse que ratesData no sea undefined
                updateRateDisplay(ratesData);
            }
            closeDropdownMenu(); // Cierra el menú después de seleccionar una opción
        });
    });
*/
    // Estado de la aplicación
    let currentInput = "0";
    let activeRateValue = 0; // La tasa seleccionada para el cálculo (valor numérico)
    let currentRateSource = 'BCV'; // 'BCV', 'Paralelo', 'PDVSA'
    let conversionMode = 'usd_to_bs'; // 'usd_to_bs' or 'bs_to_usd'
    let currentRatesData = {}; // Almacenará los datos de las tasas actuales { rate1: {...}, rate2: {...} }

// ... (resto del código de script.js anterior) ...

    // --- SIMULACIÓN DE API Y CONSUMO REAL ---


    async function fetchBCVRates() {
        
       // source = 'BCV';
       


            source = 'BCV'; // O el valor que corresponda (Paralelo, PDVSA)

            const dataToSend = {
                source: source // Creamos un objeto JavaScript con la clave 'source' y su valor
            };
            
            const options = {
                method: 'POST', // Especificamos el método HTTP como POST
                headers: {
                    'Content-Type': 'application/json' // Indicamos que el contenido del cuerpo es JSON
                    // Puedes añadir otras cabeceras si son necesarias, por ejemplo, para autenticación
                },
                body: JSON.stringify(dataToSend) // Convertimos el objeto JavaScript a una cadena JSON para enviarla en el cuerpo
            };
            
            // Realizamos la petición fetch con la URL y el objeto de opciones
            const response = await fetch('api/data.php' , options);
            //console.log(response);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const apiData = await response.json();
            //const apiData = JSON.parse(response);
            //console.log(apiData);

       
        /*
        const apiData = {
            "Source": "BCV",
            "USD": 94.32,
            "Date": "16-05-2025",
            "DateFormat": "Viernes, 16 Mayo 2025",
            "USDNext": 94.76,
            "DateNext": "19-05-2025",
            "DateFormatNext": "Lunes, 19 Mayo 2025",
            "DateNow": "16-05-2025",
            "Status": 200
        };
        */
        if (apiData && apiData.Status === 200) {
            return {
                sourceName: apiData.Source,
                rate1: {
                    label: "Vigente",
                    currency: "USD$",
                    value: apiData.USD,
                    date: apiData.DateFormat
                },
                rate2: {
                    label: "Próximo",
                    currency: "USD$",
                    value: apiData.USDNext,
                    date: apiData.DateFormatNext
                }
            };
        } else {
            console.error("Error o formato inesperado en datos de API BCV:", apiData);
            return {
                sourceName: "BCV",
                rate1: { label: "Vigente", currency: "USD$", value: 0, date: "Error al cargar" },
                rate2: { label: "Próximo", currency: "USD$", value: 0, date: "Error al cargar" }
            };
        }
    }

    async function fetchParaleloRates() {
        // Simulación de la obtención del JSON que proporcionaste para Paralelo.
        // En una aplicación real, aquí harías:
        /*
         try {
             const response = await fetch('https://forward-deena-jhonny91.koyeb.app/v1/sources/paralelo.php?access_key=8a258f4e4b4412eb7930e87473516170');
             if (!response.ok) {
                 throw new Error(`Error HTTP: ${response.status}`);
             }
             const apiData = await response.json();
         } catch (error) {
             console.error("Error fetching Paralelo rates from API:", error);
             // Devolver datos de error para la UI
             return {
                 sourceName: "Paralelo",
                 rate1: { label: "Error", currency: "USD$", value: 0, date: "No disponible" },
                 rate2: { label: "Error", currency: "USD$", value: 0, date: "No disponible" }
             };
         }
        

        // Usamos el JSON proporcionado directamente para este ejemplo:
        
       
        const apiData = {
            "Source": "Paralelo",
            "USD": 120.55,
            "Date": "16-05-2025",
            "DateFormat": "Viernes, 16 Mayo 2025",
            "USDNext": 101.9,
            "DateNext": "",
            "DateFormatNext": "", // Importante: puede estar vacío
            "DateNow": "16-05-2025",
            "Status": 200
        };
         */
        source = 'Paralelo'; // O el valor que corresponda (Paralelo, PDVSA)

        const dataToSend = {
            source: source // Creamos un objeto JavaScript con la clave 'source' y su valor
        };
        
        const options = {
            method: 'POST', // Especificamos el método HTTP como POST
            headers: {
                'Content-Type': 'application/json' // Indicamos que el contenido del cuerpo es JSON
                // Puedes añadir otras cabeceras si son necesarias, por ejemplo, para autenticación
            },
            body: JSON.stringify(dataToSend) // Convertimos el objeto JavaScript a una cadena JSON para enviarla en el cuerpo
        };
        
        // Realizamos la petición fetch con la URL y el objeto de opciones
        const response = await fetch('api/data.php' , options);
        //console.log(response);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const apiData = await response.json();
        //const apiData = JSON.parse(response);
        //console.log(apiData);


        // Transformar al formato esperado por updateRateDisplay
        if (apiData && apiData.Status === 200) {
            return {
                sourceName: apiData.Source, // "Paralelo"
                rate1: {
                    label: "Paralelo",     // Etiqueta según tu instrucción
                    currency: "USD$",      // Asumido, ya que la clave es "USD"
                    value: apiData.USD,    // Valor para "Paralelo"
                    date: apiData.DateFormat // Fecha para "Paralelo"
                },
                rate2: {
                    label: "Promedio",     // Etiqueta según tu instrucción
                    currency: "USD$",      // Asumido
                    value: apiData.USDNext,// Valor para "Promedio"
                    date: apiData.DateFormatNext // Fecha para "Promedio", será string vacío si no hay
                }
            };
        } else {
            console.error("Error o formato inesperado en datos de API Paralelo:", apiData);
            // Devolver datos por defecto o de error para que la UI no se rompa
            return {
                sourceName: "Paralelo",
                rate1: { label: "Paralelo", currency: "USD$", value: 0, date: "Error al cargar" },
                rate2: { label: "Promedio", currency: "USD$", value: 0, date: "Error al cargar" }
            };
        }
    }


    // --- MANEJO DEL MENÚ ---
    menuToggleButton.addEventListener('click', () => {
        if (dropdownMenu.classList.contains('show')) {
            closeDropdownMenu();
        } else {
            dropdownMenu.classList.add('show');
            // Añadir el botón 'X' si aún no existe
             if (!document.getElementById('closeMenuBtn')) {
                const closeBtn = document.createElement('button');
                closeBtn.innerHTML = '&times;'; // Caracter 'X'
                closeBtn.id = 'closeMenuBtn';
                closeBtn.className = 'close-menu-button';
                closeBtn.setAttribute('aria-label', 'Cerrar menú');
                closeBtn.onclick = closeDropdownMenu; // Asignar la función de cierre
                dropdownMenu.prepend(closeBtn); // Añade el botón X al inicio del menú
            }
        }
    });

    menuButtons.forEach(button => {
        button.addEventListener('click', async () => {
            currentRateSource = button.dataset.source;

            // Cierra el menú principal siempre al seleccionar una opción
            closeDropdownMenu();

            // Verifica si la fuente seleccionada es PDVSA
            if (currentRateSource === 'PDVSA') {
                // Si es PDVSA, actualiza el título de la app y muestra el modal de PDVSA
                // appTitleSource.textContent = currentRateSource;
                pdvsaModal.style.display = 'flex'; // Muestra el modal (usando flex para centrar)

                // Oculta la información de placa y fechas hasta que se seleccione un botón de placa
                 placaInfoSection.style.display = 'none'; // Ocultar la sección completa si usaste el div
                 placaDisplay.textContent = ''; // Limpiar contenido previo
                 datesDisplay.innerHTML = ''; // Limpiar contenido previo
                 datesDisplay.style.display = 'none'; // Asegurarse de que la lista de fechas esté oculta

                // No hacer nada más con las tasas en la pantalla principal para PDVSA
            } else {
                // Si es BCV o Paralelo, actualiza el título y la pantalla de tasas principal
                appTitleSource.textContent = currentRateSource;
                let ratesData;
                if (currentRateSource === 'BCV') {
                    ratesData = await fetchBCVRates();
                } else if (currentRateSource === 'Paralelo') {
                    ratesData = await fetchParaleloRates();
                }

                // Asegúrate de que ratesData no sea undefined antes de actualizar la pantalla
                if (ratesData) {
                    updateRateDisplay(ratesData);
                }
                // La pantalla principal ya debería estar visible por defecto
            }
        });
    });

    // --- MANEJO DEL MODAL PDVSA ---

    // Event listener para el botón de cierre del modal PDVSA
    closePdvsaModalButton.addEventListener('click', () => {
        pdvsaModal.style.display = 'none'; // Oculta el modal
        // Opcional: Resetear el contenido del modal al cerrarlo
        placaInfoSection.style.display = 'none';
        placaDisplay.textContent = '';
        datesDisplay.innerHTML = '';
        datesDisplay.style.display = 'none';
    });

    // Event listeners para los botones de placa dentro del modal
    // Event listeners para los botones de placa dentro del modal PDVSA
    plateButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const plateRange = button.dataset.range; // Obtiene el rango de placa (ej: '1 - 2')
            const plateOffset = parseInt(button.dataset.offset); // Obtiene el offset de días (ej: 0)

            // Mostrar el rango de placa seleccionado inmediatamente
            placaDisplay.textContent = `Placa ${plateRange}`;
            placaInfoSection.style.display = 'block'; // Asegurarse de que la sección Placa esté visible

            // Mostrar mensaje de carga y ocultar fechas anteriores
            datesDisplay.innerHTML = '<p>Cargando calendario...</p>';
            datesDisplay.style.display = 'block'; // Asegurarse de que la lista de fechas esté visible


            // --- Hacer la petición POST a tu script PHP para obtener las fechas calculadas ---
            try {
                const response = await fetch('api/data.php', { // URL de tu script PHP
                    method: 'POST', // Usamos POST
                    headers: {
                        'Content-Type': 'application/json' // Indicamos que enviamos JSON
                    },
                    // Enviamos la fuente 'PDVSA' y el offset de la placa seleccionada en el body
                    body: JSON.stringify({ source: 'PDVSA', plateOffset: plateOffset })
                });

                // Verificar si la respuesta HTTP fue exitosa
                if (!response.ok) {
                    const errorText = await response.text(); // Intentar leer el texto de error del servidor
                    throw new Error(`Error en la petición al servidor: ${response.status} - ${errorText}`);
                }

                // Parsear la respuesta JSON del servidor
                const data = await response.json();

                // Verificar si la respuesta del servidor contiene Status 200 y el array de Fechas
                if (data && data.Status === 200 && data.Dates && Array.isArray(data.Dates)) {
                    // --- Mostrar las fechas recibidas ---
                    let datesHtml = '';
                    data.Dates.forEach(dateString => {
                        datesHtml += `<p>${dateString}</p>`; // Añadir cada string de fecha recibida
                    });
                    datesDisplay.innerHTML = datesHtml; // Insertar la lista de fechas en el HTML

                } else {
                    // Manejar el error si PHP devolvió un status de error o faltan los datos de fechas
                    console.error("El servidor PHP devolvió un error o faltan datos en la respuesta:", data);
                    datesDisplay.innerHTML = '<p>Error al cargar el calendario.</p>'; // Mensaje de error en la UI
                }

            } catch (error) {
                // Manejar errores de red durante la petición fetch
                console.error("Error durante la petición fetch:", error);
                datesDisplay.innerHTML = '<p>Error de conexión al cargar el calendario.</p>'; // Mensaje de error en la UI
            }
        });
    });

    // --- ACTUALIZACIÓN DE TASAS EN LA UI ---
    function updateRateDisplay(data) {
        currentRatesData = data; // Guarda los datos actuales

        // Update rateBox1 (Vigente/Paralelo/PDVSA Activa)
        rateLabel1.textContent = data.rate1.label + ':';
        rateCurrency1.textContent = data.rate1.currency;
        rateValue1.textContent = parseFloat(data.rate1.value).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        rateDate1.textContent = data.rate1.date || "";
        rateBox1.dataset.rateValue = data.rate1.value; // Guardar el valor para fácil acceso

        // Update rateBox2 (Próximo/Promedio/PDVSA Petro)
        // Check if data.rate2 and its date/value exist before updating
        if (data.rate2 && data.rate2.value !== undefined && data.rate2.date !== undefined) { // Verificamos que existan rate2, value y date
            rateLabel2.textContent = data.rate2.label + ':';
            rateCurrency2.textContent = data.rate2.currency;
            rateValue2.textContent = parseFloat(data.rate2.value).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            rateDate2.textContent = data.rate2.date;
            rateBox2.dataset.rateValue = data.rate2.value;
        } else {
             // Handle cases where rate2 data is missing or incomplete
             rateLabel2.textContent = 'Próximo:'; // Etiqueta por defecto si falta data.rate2
             rateCurrency2.textContent = 'USD$'; // Moneda por defecto
             rateValue2.textContent = '0.00';
             rateDate2.textContent = '';
             rateBox2.dataset.rateValue = '0';
        }


        // Logic to hide rateBox2 and center rateBox1 ONLY FOR BCV if dates are the same or rate2 data is missing/zero
        const ratesSection = document.querySelector('.rates-section'); // Get the parent container

        const datesAreSame = data.rate1.date && data.rate2 && data.rate2.date && data.rate1.date === data.rate2.date;
        const rate2DataMissingOrZero = !data.rate2 || !data.rate2.date || parseFloat(data.rate2.value) === 0; // Consideramos si rate2 data está missing, la fecha está missing o el valor es 0


        // Condición principal: Ocultar/Centrar solo si es BCV Y (las fechas son iguales O falta data de rate2 o su valor es cero)
        if (currentRateSource === 'BCV' && (datesAreSame || rate2DataMissingOrZero)) {
            // Si es BCV y las condiciones se cumplen, ocultamos rateBox2 y centramos rateBox1
            rateBox2.style.display = 'none';
            ratesSection.style.justifyContent = 'center';
            rateBox1.style.flex = 'unset'; // Remove flex: 1
            rateBox1.style.width = 'calc(100% - 20px)'; // Ajustar ancho
            rateBox1.style.margin = '0 auto'; // Centrar el bloque
            rateBox1.style.marginRight = '0'; // Asegurar que no haya margen de flex gap

            // rateBox1 es la única visible, la marcamos como activa
            rateBox1.classList.add('active-rate');
            rateBox2.classList.remove('active-rate');
            activeRateValue = parseFloat(data.rate1.value); // La tasa activa es la de rate1

        } else {
            // Si no es BCV, o si es BCV pero las fechas son diferentes, mostramos ambas cajas
            rateBox2.style.display = 'flex'; // Mostrar rateBox2
            ratesSection.style.justifyContent = 'space-between'; // Distribuir espacio
            rateBox1.style.flex = '1'; // Restaurar flex: 1
            rateBox2.style.flex = '1'; // Restaurar flex: 1 para rateBox2
            rateBox1.style.width = ''; // Resetear ancho
            rateBox1.style.margin = ''; // Resetear margen
            rateBox2.style.width = ''; // Resetear ancho
            rateBox2.style.margin = ''; // Resetear margen


            // Lógica de selección por defecto cuando ambas cajas están visibles: Seleccionar rate1
            rateBox1.classList.add('active-rate');
            rateBox2.classList.remove('active-rate');
            activeRateValue = parseFloat(data.rate1.value);
        }

        // Nota: Los event listeners para click en rateBox1 y rateBox2 seguirán funcionando
        // independientemente de si están visibles u ocultos (aunque solo se podrán clickear si están visibles).

        updateCalculation(); // Recalcular con la tasa activa (que ya está actualizada)
    }

    // Event listeners para seleccionar tasa individual
    rateBox1.addEventListener('click', () => {
        if (currentRatesData && currentRatesData.rate1) {
            activeRateValue = parseFloat(currentRatesData.rate1.value);
            rateBox1.classList.add('active-rate');
            rateBox2.classList.remove('active-rate');
            updaterates();
            updateCalculation();
        }
    });

    rateBox2.addEventListener('click', () => {
         if (currentRatesData && currentRatesData.rate2) {
            activeRateValue = parseFloat(currentRatesData.rate2.value);
            rateBox2.classList.add('active-rate');
            rateBox1.classList.remove('active-rate');
            updaterates();
            updateCalculation();
        }
    });


    // --- LÓGICA DE LA CALCULADORA (similar a la anterior) ---
    swapButton.addEventListener('click', () => {
        if (conversionMode === 'usd_to_bs') {
            conversionMode = 'bs_to_usd';
            fromCurrencyLabel.textContent = 'Bolívar Bs.'; // O moneda local
            toCurrencyLabel.textContent = currentRatesData.rate1 ? currentRatesData.rate1.currency.slice(0, -1) : 'Divisa'; // Dolar $, Euro €, etc.
        } else {
            conversionMode = 'usd_to_bs';
            fromCurrencyLabel.textContent = currentRatesData.rate1 ? currentRatesData.rate1.currency.slice(0, -1) : 'Divisa';
            toCurrencyLabel.textContent = 'Bolívar Bs.';
        }
        updateDisplayAndCalc();
        //updateCalculation();
    });

    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            const number = button.textContent;
            if (number === '.' && currentInput.includes('.')) return;
            if (number === '.' && currentInput === "0") {
                 currentInput = "0.";
            } else if (currentInput === "0" && number !== '.') {
                currentInput = number;
            } else {
                if (currentInput.length < 15) { // Limitar longitud de entrada
                    currentInput += number;
                }
            }
            updateDisplayAndCalc();
        });
    });

    function updateDisplayAndCalc() {
        // Determinar el símbolo de la moneda para la caja de texto principal
        let mainInputCurrencySymbol = '';
        //console.log(conversionMode);
         if (currentRatesData && currentRatesData.rate1) {
             if (conversionMode === 'usd_to_bs') {
                 mainInputCurrencySymbol = currentRatesData.rate1.currency ? currentRatesData.rate1.currency.slice(0, -1) : '$';
             } else {
                 mainInputCurrencySymbol = 'Bs.';
             }
         } else {
              mainInputCurrencySymbol = (conversionMode === 'usd_to_bs') ? '$' : 'Bs.';
         }

        // Actualizar la caja de texto principal (main-display) con el valor actual y el símbolo
        // Asegurarse de manejar el caso de entrada vacía o "0"
        if (currentInput === "" || currentInput === "0") {
            mainDisplay.value = "0 " + mainInputCurrencySymbol;
        } else {
             // Añadir el símbolo con un espacio al final del valor digitado
             mainDisplay.value = currentInput + " " + mainInputCurrencySymbol;
        }

        // Limpiar el contenido del input amount display span (el que está oculto)
        // Ya no necesitamos calcular 'formattedInput' para este elemento.
        inputAmountDisplay.textContent = ''; // <-- Esta línea limpia y evita el error

        // Llamar a updateCalculation para actualizar el resultado de la conversión
        updateCalculation();
    }

    function updateCalculation() {
        
        const amount = parseFloat(currentInput.replace(',', '.')); // Usar punto para parseFloat si la entrada usa coma
        // Si el input está vacío o solo tiene un punto/coma, considera 0
        if (currentInput === "" || currentInput === "." || currentInput === ",") {
             amount = 0;
        }


        // Manejar el caso de resultado 0 o tasa no válida
        if (isNaN(amount) || !activeRateValue || activeRateValue === 0) {
            // Mostrar "0.00 Bs." o "0.00 $" dependiendo del modo si el resultado es 0 o inválido
             const defaultSymbol = (conversionMode === 'usd_to_bs') ? 'Bs.' : '$';
            convertedAmountDisplay.textContent = `0,00 ${defaultSymbol}`;
            return;
        }

        let result;
        let outputCurrencySymbol = ''; // Símbolo de la moneda de salida

        if (conversionMode === 'usd_to_bs') { // De Divisa (USD, EUR) a Bolívares
            result = amount * activeRateValue;
            outputCurrencySymbol = 'Bs.'; // La salida es en Bolívares
        } else { // bs_to_usd: De Bolívares a Divisa
            result = amount / activeRateValue;
            // La salida es la Divisa. Obtenemos el símbolo de rate1.currency sin el último carácter.
            outputCurrencySymbol = currentRatesData.rate1 ? currentRatesData.rate1.currency.slice(0, -1) : '$'; // Default a '$'
        }

        // Formatear el resultado de la conversión
        const formattedResult = result.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        // Actualizar el converted amount display con el resultado formateado y el símbolo
        convertedAmountDisplay.textContent = `${formattedResult} ${outputCurrencySymbol}`;
    }

    clearButton.addEventListener('click', () => {
        currentInput = "0";
        updateDisplayAndCalc();
    });

    backspaceButton.addEventListener('click', () => {
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = "0";
        }
        updateDisplayAndCalc();
    });

    pasteButton.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            const pastedValue = parseFloat(text.replace(',', '.').replace(/[^0-9.]/g, '')); // Limpiar un poco más
            if (!isNaN(pastedValue)) {
                currentInput = String(pastedValue).slice(0,15); // Limitar longitud
                updateDisplayAndCalc();
            } else {
                // alert("El contenido del portapapeles no es un número válido.");
            }
        } catch (err) {
            // console.error('Failed to read clipboard contents: ', err);
        }
    });

    copyResultButton.addEventListener('click', () => {
        const fullText = convertedAmountDisplay.textContent;
        // Encontrar el índice del último espacio para separar el número del símbolo.
        // Asumimos que hay un espacio entre el número y el símbolo (ej: "123,45 Bs.")
        const lastSpaceIndex = fullText.lastIndexOf(' ');
        let textToCopy = fullText; // Por defecto, toma el texto completo

        if (lastSpaceIndex !== -1) {
            // Si se encontró un espacio, toma la subcadena ANTES del último espacio (que debería ser el número)
            textToCopy = fullText.substring(0, lastSpaceIndex);
        }

        // Ahora, formatea la parte numérica para copiar:
        // 1. Elimina los separadores de miles (puntos).
        // 2. Reemplaza el separador decimal (coma) por un punto, que es el formato numérico estándar para copiar/pegar en muchos sistemas.
        textToCopy = textToCopy.replace(/\./g, '').replace(',', '.');

        // Copiar el número formateado al portapapeles
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Opcional: Mostrar un feedback visual sutil (ej: un pequeño tooltip o cambio de color temporal)
            console.log('Resultado copiado:', textToCopy); // Para depuración
        }).catch(err => {
            console.error('Error al copiar resultado: ', err);
            // Opcional: Mostrar un mensaje de error al usuario
        });
    });
    // Asegúrate que la inicialización no muestre el menú

    // --- INICIALIZACIÓN ---
    async function initializeApp() {
        // Asegurarse de que el modal PDVSA esté oculto al inicio
                pdvsaModal.style.display = 'none';
                placaInfoSection.style.display = 'none';
                datesDisplay.style.display = 'none';
        // Cargar BCV por defecto al iniciar
        const initialRates = await fetchBCVRates();
        if (initialRates) { // Chequeo adicional
            updateRateDisplay(initialRates);
            appTitleSource.textContent = initialRates.sourceName;
            if (initialRates.rate1) { // Chequeo adicional
               fromCurrencyLabel.textContent = initialRates.rate1.currency ? initialRates.rate1.currency.slice(0,-1) : 'Divisa';
            }
       }
        appTitleSource.textContent = initialRates.sourceName;
        // Asegurar que las etiquetas de moneda de conversión iniciales sean correctas
        fromCurrencyLabel.textContent = initialRates.rate1 ? initialRates.rate1.currency.slice(0,-1) : 'Divisa';
        updateDisplayAndCalc(); // Para mostrar 0.00 inicialmente


    }

    initializeApp();

        // --- TEST clic update data ---
        async function updaterates() {
            // Asegurarse de que el modal PDVSA esté oculto al inicio
                    pdvsaModal.style.display = 'none';
                    placaInfoSection.style.display = 'none';
                    datesDisplay.style.display = 'none';
            // Clic
            const titleSource = appTitleSource.textContent;
            //console.log(titleSource);
            
            let ratesData;
            if (titleSource === 'BCV') {
                
                ratesData = await fetchBCVRates();
            } else if (titleSource === 'Paralelo') {
                
                ratesData = await fetchParaleloRates();
            }
            
            if (ratesData) { // Asegurarse que ratesData no sea undefined
                currentRatesData = ratesData; // Guarda los datos actuales
                data = ratesData;
                // Update rateBox1 (Vigente/Paralelo/PDVSA Activa)
                rateLabel1.textContent = data.rate1.label + ':';
                rateCurrency1.textContent = data.rate1.currency;
                rateValue1.textContent = parseFloat(data.rate1.value).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                rateDate1.textContent = data.rate1.date || "";
                rateBox1.dataset.rateValue = data.rate1.value; // Guardar el valor para fácil acceso
        
                // Update rateBox2 (Próximo/Promedio/PDVSA Petro)
                // Check if data.rate2 and its date/value exist before updating
                if (data.rate2 && data.rate2.value !== undefined && data.rate2.date !== undefined) { // Verificamos que existan rate2, value y date
                    rateLabel2.textContent = data.rate2.label + ':';
                    rateCurrency2.textContent = data.rate2.currency;
                    rateValue2.textContent = parseFloat(data.rate2.value).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    rateDate2.textContent = data.rate2.date;
                    rateBox2.dataset.rateValue = data.rate2.value;
                } else {
                     // Handle cases where rate2 data is missing or incomplete
                     rateLabel2.textContent = 'Próximo:'; // Etiqueta por defecto si falta data.rate2
                     rateCurrency2.textContent = 'USD$'; // Moneda por defecto
                     rateValue2.textContent = '0.00';
                     rateDate2.textContent = '';
                     rateBox2.dataset.rateValue = '0';
                }
        
        
                // Logic to hide rateBox2 and center rateBox1 ONLY FOR BCV if dates are the same or rate2 data is missing/zero
                const ratesSection = document.querySelector('.rates-section'); // Get the parent container
        
                const datesAreSame = data.rate1.date && data.rate2 && data.rate2.date && data.rate1.date === data.rate2.date;
                const rate2DataMissingOrZero = !data.rate2 || !data.rate2.date || parseFloat(data.rate2.value) === 0; // Consideramos si rate2 data está missing, la fecha está missing o el valor es 0
        
        
                // Condición principal: Ocultar/Centrar solo si es BCV Y (las fechas son iguales O falta data de rate2 o su valor es cero)
                if (currentRateSource === 'BCV' && (datesAreSame || rate2DataMissingOrZero)) {
                    // Si es BCV y las condiciones se cumplen, ocultamos rateBox2 y centramos rateBox1
                    rateBox2.style.display = 'none';
                    ratesSection.style.justifyContent = 'center';
                    rateBox1.style.flex = 'unset'; // Remove flex: 1
                    rateBox1.style.width = 'calc(100% - 20px)'; // Ajustar ancho
                    rateBox1.style.margin = '0 auto'; // Centrar el bloque
                    rateBox1.style.marginRight = '0'; // Asegurar que no haya margen de flex gap
        
                    // rateBox1 es la única visible, la marcamos como activa
                    rateBox1.classList.add('active-rate');
                    rateBox2.classList.remove('active-rate');
                    activeRateValue = parseFloat(data.rate1.value); // La tasa activa es la de rate1
        
                } else {
                    // Si no es BCV, o si es BCV pero las fechas son diferentes, mostramos ambas cajas
                    rateBox2.style.display = 'flex'; // Mostrar rateBox2
                    ratesSection.style.justifyContent = 'space-between'; // Distribuir espacio
                    rateBox1.style.flex = '1'; // Restaurar flex: 1
                    rateBox2.style.flex = '1'; // Restaurar flex: 1 para rateBox2
                    rateBox1.style.width = ''; // Resetear ancho
                    rateBox1.style.margin = ''; // Resetear margen
                    rateBox2.style.width = ''; // Resetear ancho
                    rateBox2.style.margin = ''; // Resetear margen
        
        
                    // Lógica de selección por defecto cuando ambas cajas están visibles: Seleccionar rate1
                 //   rateBox1.classList.add('active-rate');
                  //  rateBox2.classList.remove('active-rate');
                    activeRateValue = parseFloat(data.rate1.value);
                }
        
                // Nota: Los event listeners para click en rateBox1 y rateBox2 seguirán funcionando
                // independientemente de si están visibles u ocultos (aunque solo se podrán clickear si están visibles).
        
                updateCalculation(); // Recalcular con la tasa activa (que ya está actualizada)
            }
            closeDropdownMenu(); // Cierra el menú después de seleccionar una opción
       

    
        }
    
        
    
});