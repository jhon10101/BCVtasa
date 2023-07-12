$(function() {

    window.onload = function() {
        updateTasa();
        document.getElementById("montoText").addEventListener("input", myFunction);
         usdToday ="1";
         document.getElementById("montoText").focus();
    };

    function round(num) {
        var m = Number((Math.abs(num) * 100).toPrecision(15));
        return Math.round(m) / 100 * Math.sign(num);
    }
    

    function updateTasa() {

        let category = 0;
        $('#valor-vigente').html(0);
        $('#valor-next').html(0);
        $('#fecha-next').html("");

        $.post('api/data.php', {category}, function (response) {
            let tasks = JSON.parse(response);
                usdToday = parseFloat(tasks.USDToday);
                var usdNext = parseFloat(tasks.USDNext);
                $('#valor-vigente').html(usdToday);
                $('#valor-next').html(usdNext);
                var dateToday = (tasks.DateToday);
                var dateNext = (tasks.DateNext);
            //  $('#fecha-vigente').html(dateToday);
                $('#fecha-next').html(dateNext);
            
        });

    }

    function myFunction() {
        var textValores = document.getElementById("montoText").value;
      
      textValores = parseFloat(textValores);

        textValores = round(textValores);

        let conversion = document.getElementById("valorText").innerHTML = textValores;

        moneda = document.getElementsByClassName("currency1")[0].innerHTML;
        moneda = moneda.replace(/\s+/g, '');
        console.log(conversion);

        

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
        console.log(PrevioText.length);
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