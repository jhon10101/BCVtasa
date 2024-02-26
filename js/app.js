$(function() {

    window.onload = function() {
        source = 'BCV';
        $('#sourceTasa').html(source);
        
       updateTasa();
       document.getElementById("montoText").addEventListener("input", myFunction);
        usdToday ="1";
        document.getElementById("montoText").focus();
        datePlaca = 0;

   };

   $(document).on('click', '.exchange-source', function () {
       let element = $(this)[0]; 
       source = $(element).attr('value');
       $('#sourceTasa').html(source);
       if (source == "Paralelo"){
           $('#source-paralelo').html(source);
           $("#source-paralelo").show();
           $("#valor-vigente").addClass("text-success");
           $("#valor-vigente").removeClass("text-warning");
       }else{
           $("#source-paralelo").hide();
           $("#valor-vigente").addClass("text-warning");
           $("#valor-vigente").removeClass("text-success");
       }
       
        updateTasa();
    });

    $(document).on('click', '.calendar-source', function () {
            var sourceTemp = source;

            let element = $(this)[0]; 
            source = $(element).attr('value');

            $.post('api/data.php', {source}, function (response) {
                let tasks = JSON.parse(response);
                source = sourceTemp;
                datePlaca = tasks.DatePlaca; // Fecha Placa 1
                nextDate = tasks.NextDate; // Fecha siguiente actualizacion
                dateActual = tasks.Date; // Fecha Actual
            });
            x = 0;
            document.getElementById("placaId").innerHTML = "";
            for (var i = 0; i < 5; i++) {
                x = x + 1;
                var fechax = x;
                fechax = fechax * 10;
                document.getElementById(fechax).innerHTML = "";
            }
            source = sourceTemp;
            updateTasa();
     });

     $(document).on('click', '.placas', function () {
        const dateF = new Date();
        var enDate = new Intl.DateTimeFormat("en-US").format(dateF);

        let element = $(this)[0]; 
        placaIds = $(element).attr('value');
        var sourceID = $(element).attr('id');

        $('#placaId').html(placaIds);

          var fecha = new Date(datePlaca);

            var x = 0;
            var y = 0;
            day = parseInt(sourceID);
            var dias = 0 + day; // Número de días a agregar
            var dias1 = 5; // Número de días a agregar

            for (var i = 0; i < 5; i++) {
                    x = x + 1;
                    fecha.setDate(fecha.getDate() + dias);

                var fecha1 = new Intl.DateTimeFormat("es", {
                    weekday: "short",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }).format(new Date(fecha));  

                var datetoday = fecha.toLocaleDateString();
                
                var fechax = x;
                fechax = fechax * 10;
                document.getElementById(fechax).innerHTML = "";
                var enDate1 = new Date(enDate);
                var datetoday = new Date(datetoday);
                    if (datetoday >= enDate1){               
                        document.getElementById(fechax).innerHTML = fecha1;
                    }else{
                        x = x - 1;
                        i = i - 1;
                    } 
                dias = dias1;
            }
              fecha = 0;
     });

    function readClipText(){
        var clipPromise = navigator.clipboard.readText();
        clipPromise.then(function(clipText){

          if (parseFloat(clipText)) {
            document.getElementById("montoText").value = clipText;
            myFunction();         
          }

        });
    }

    $(".pegar").click(function(){
        readClipText();
    });
    
    var clipboard = new ClipboardJS('.copiado');
    clipboard.on('success', function(e) {

            let valTemp = document.getElementById("valorTotal").innerHTML;
            $('#valorTotal').html("Copiado!");
            $("#valorTotal").addClass("text-success");

            e.clearSelection();
            setTimeout(function(){
                document.getElementById("valorTotal").innerHTML = valTemp;
                $("#valorTotal").removeClass("text-success");
            }, 1200)
     });

    function round(num) {
        var m = Number((Math.abs(num) * 100).toPrecision(15));
        return Math.round(m) / 100 * Math.sign(num);
    }

    function updateTasa() {
        $("#proximo").hide();

        $('#valor-vigente').html(0);
        $('#valor-next').html(0);
        $('#fecha-next').html("");

        $.post('api/data.php', {source}, function (response) {
            let tasks = JSON.parse(response);
           
                usdToday = parseFloat(tasks.USD); // Tasa vigente
                usdNext = parseFloat(tasks.USDNext); // Tasa siguiente

                var dateToday = (tasks.DateFormat); // fecha con formato vigente
                var dateNext = (tasks.DateFormatNext); // fecha con formato Siguiente

                var dateNext2 = (tasks.DateNext); // fecha Siguiente
                var date = (tasks.Date); // fecha con vigente
                var dateNow = (tasks.Date); // fecha actual

                $('#fecha-next').html(dateNext);
                $("#proximo").hide();
                $("#vigente").addClass("col-12");
                $("#vigente").removeClass("col-6");

               if ((date)==(dateNext2)) {
                    $("#proximo").hide();
               } else {
                    if ((dateNow)==(dateNext2)) {
                      $("#proximo").hide();
                        usdToday = usdNext;
                    } else {
                        if ((dateNext2) != "0") {
                            $("#proximo").show();
                            $("#vigente").addClass("col-6");
                            $("#vigente").removeClass("col-12");      
                        }
                    }
               }
               $('#valor-vigente').html(usdToday);
               $('#valor-next').html(usdNext);
               myFunction();
        });

    }

    function myFunction() {
        var textValores = document.getElementById("montoText").value;
        if (textValores == "") {
            textValores = 0;
        }
      
      textValores = parseFloat(textValores);

        textValores = round(textValores);

        let conversion = document.getElementById("valorText").innerHTML = textValores;

        moneda = document.getElementsByClassName("currency1")[0].innerHTML;
        moneda = moneda.replace(/\s+/g, '');

       if (moneda == "BolivarBs.") {
            total = conversion / usdToday;
       }else{
            total = conversion * usdToday;    
       }
       total = round(total);

        $('#valorTotal').html(total);
    }

    $(document).on('click', '.updateTasaBCV', function () {
        updateTasa();  
    });

    $(document).on('click', '.BtnExchange', function () {
        var moneda = document.getElementsByClassName("currency1")[0].innerHTML;
        moneda = moneda.replace(/\s+/g, '');

       if (moneda == "BolivarBs.") {
            document.getElementsByClassName("currency1")[0].innerHTML = "Dolar $";
            document.getElementsByClassName("currency2")[0].innerHTML = "Bolivar Bs.";
            document.getElementsByClassName("currency1")[1].innerHTML = "Dolar";
            document.getElementsByClassName("currency2")[1].innerHTML = "Bolivar";
       } else {
            document.getElementsByClassName("currency1")[0].innerHTML = "Bolivar Bs.";
            document.getElementsByClassName("currency2")[0].innerHTML = "Dolar $";
            document.getElementsByClassName("currency1")[1].innerHTML = "Bolivar";
            document.getElementsByClassName("currency2")[1].innerHTML = "Dolar";
       }

       myFunction()

    });

    $(document).on('click', '.BtnDelete', function () {               

        PrevioText = document.getElementById("montoText").value;

        if ((PrevioText.length) > 0) {
            if ((PrevioText.length) == 1) {
                myFunction();
                document.getElementById("montoText").value = "";
                document.getElementById("montoText").focus();
                document.getElementById("valorText").innerHTML = 0;
                document.getElementById("valorTotal").innerHTML = 0;
            }else{
                document.getElementById("montoText").value = PrevioText.substring(0, PrevioText.length - 1);
                myFunction();
            }
        }if ((PrevioText.length) == 0) {
            myFunction();
            document.getElementById("montoText").value = "";
            document.getElementById("montoText").focus();
            document.getElementById("valorText").innerHTML = 0;
            document.getElementById("valorTotal").innerHTML = 0; 
        } 

       
    });

    $(document).on('click', '.Btncalculator', function () {
       let element = $(this)[0]; 
       let valores = $(element).attr('value');
       PrevioText = document.getElementById("montoText").value;
       document.getElementById("montoText").value += valores;

        myFunction();
    });

    $(document).on('click', '.Btnclear', function () {
        $('form').trigger('reset');
        myFunction();
        document.getElementById("montoText").focus();
        document.getElementById("valorText").innerHTML = 0;
        document.getElementById("valorTotal").innerHTML = 0;
    });

});