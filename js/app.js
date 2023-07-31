$(function() {

    window.onload = function() {
        updateTasa();
        document.getElementById("montoText").addEventListener("input", myFunction);
         usdToday ="1";
         document.getElementById("montoText").focus();
         /*
         const target = document.querySelector("input.target");

            target.addEventListener("onchange", (event) => {
                event.preventDefault();

                let paste = (event.clipboardData || window.clipboardData).getData("text");
                paste = paste.toUpperCase();
                const selection = window.getSelection();
                if (!selection.rangeCount) return;
                selection.deleteFromDocument();
                selection.getRangeAt(0).insertNode(document.createTextNode(paste));
                selection.collapseToEnd();
                console.log(paste);
            });
           
            if(navigator.clipboard){
                console.log("paste");
              }else{
                //No soporta la API, tenemos que usar viejos métodos
              }
         */
    };
    function readClipText(){
        var clipPromise = navigator.clipboard.readText();
        clipPromise.then(function(clipText){
           // document.getElementById("montoText").addEventListener("input", myFunction);
          //  document.getElementById("montoText").focus();
          if (parseFloat(clipText)) {
            document.getElementById("montoText").value = clipText;
            myFunction();         
          }

        });
        
        
    }
    $(".pegar").click(function(){
        readClipText();

      //  myFunction();
    });
    
    var clipboard = new ClipboardJS('.copiado');
    clipboard.on('success', function(e) {
     //  console.info('Action:', e.action);
     //  console.info('Text:', e.text);
     //  console.info('Trigger:', e.trigger);
         console.info(e.text);
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
      //  let category = 0;
        let source = 'bcv';
        $('#valor-vigente').html(0);
        $('#valor-next').html(0);
        $('#fecha-next').html("");

 //{"Source":"BCV","USD":"29.88","Date":"21-07-2023","DateFormat":"Viernes, 21 Julio 2023","USDNext":29.09,"DateNext":"25-07-2023","DateFormatNext":"Martes, 25 Julio 2023","DateNow":"24-07-2023","Status":200}
 
        $.post('api/data.php', {source}, function (response) {
            let tasks = JSON.parse(response);
           
                usdToday = parseFloat(tasks.USD); // Tasa vigente
                usdNext = parseFloat(tasks.USDNext); // Tasa siguiente

                var dateToday = (tasks.DateFormat); // fecha con formato vigente
                var dateNext = (tasks.DateFormatNext); // fecha con formato Siguiente

                var dateNext2 = (tasks.DateNext); // fecha Siguiente
                var date = (tasks.Date); // fecha con vigente
                var dateNow = (tasks.Date); // fecha actual
            //  $('#fecha-vigente').html(dateToday);
                $('#fecha-next').html(dateNext);
                $("#proximo").hide();
                $("#vigente").addClass("col-12");
                $("#vigente").removeClass("col-6");
             //  document.querySelector('#proximo').style.display = 'none';

               if ((date)==(dateNext2)) {
                    $("#proximo").hide();
                    //   console.log(usdToday);
               } else {
                    if ((dateNow)==(dateNext2)) {
                      $("#proximo").hide();
                        usdToday = usdNext;
                     //   console.log(usdToday);
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
       // console.log(conversion);

        

       if (moneda == "Bolivar") {
            total = conversion / usdToday;
       }else{
            total = conversion * usdToday;    
       }
       total = round(total);
       // total = total.toFixed(2);

        $('#valorTotal').html(total);
    }

    $(document).on('click', '.updateTasaBCV', function () {
        updateTasa();  
    });

    $(document).on('click', '.BtnExchange', function () {
        var moneda = document.getElementsByClassName("currency1")[0].innerHTML;
        moneda = moneda.replace(/\s+/g, '');

       if (moneda == "Bolivar") {
            document.getElementsByClassName("currency1")[0].innerHTML = "Dolar";
            document.getElementsByClassName("currency2")[0].innerHTML = "Bolivar";
            document.getElementsByClassName("currency1")[1].innerHTML = "Dolar";
            document.getElementsByClassName("currency2")[1].innerHTML = "Bolivar";
       } else {
            document.getElementsByClassName("currency1")[0].innerHTML = "Bolivar";
            document.getElementsByClassName("currency2")[0].innerHTML = "Dolar";
            document.getElementsByClassName("currency1")[1].innerHTML = "Bolivar";
            document.getElementsByClassName("currency2")[1].innerHTML = "Dolar";
       }

       myFunction()

    });

    $(document).on('click', '.BtnDelete', function () {               

        PrevioText = document.getElementById("montoText").value;
        // console.log(PrevioText.length);
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