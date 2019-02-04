$(function () {
    // Standardmässig Seite 1 laden
    load_seite1();

    $('#seite2').click(function () {
        $('#seite1').parent().removeClass('active');
        $('#seite2').parent().removeClass('active');
        load_seite2();
    });
    $('#seite1').click(function () {
        $('#seite1').parent().removeClass('active');
        $('#seite2').parent().removeClass('active');
        load_seite1();
    });

    $('#mobile-menu').sidenav();
});

function load_seite1() {
    $('#content').load('content/seite1.html');
    $('#seite1').parent().addClass('active');
    setTimeout(function () {
        show_cars();
    }, 100);
}

function load_seite2() {
    $.ajax({
        url: 'content/seite2.json',
        dataType: 'json',
        success: function (result) {
            $('#content').html(result.content);
            $('#seite2').parent().addClass('active');
        }
    });
}

function show_cars() {
    $.ajax({
        url: 'content/cars.json',
        dataType: 'json',
        success: function (json_autos) {
            // Einzelnes Auto ausgeben -> mit F12 die Console anschauen
            console.log(json_autos[0]);
            // nur die ID des Autos ausgeben
            console.log(json_autos[0].id);

            // Design mit id = autos_liste_template in eine Variable laden
            $('#autos_liste_template').show();
            var panel = $('#autos_liste_template').clone();
            $('#autos_liste_template').hide();

            // fals die Auto - Liste einträge enthällt, leeren
            $('#autos_liste_anzeige').html('');

            for (i = 0; i < json_autos.length; i++) {
                // Design von einem Auto klonen für die Anzeige
                var new_panel = panel.clone();
                // Tabelle farblich unterscheiden
                if (i % 2 === 0) {
                    new_panel.addClass('grey lighten-5');
                } else {
                    new_panel.addClass('grey lighten-4');
                }
                // JSON - Werte in die div mit id laden
                new_panel.find('#autos_id').html(json_autos[i].id);
                // Autoname Spezialanzeige mit einem Favicon
                new_panel.find('#autos_name').html(new_panel.find('#autos_name').html() + json_autos[i].name);
                // nur die i Elemente : Farbe vom Auto setzten anhand vom DB - Eintrag : json_autos[i].farbe
                new_panel.find('#autos_name i').css('color', json_autos[i].farbe);
                // alle andern Elemente anzeigen
                new_panel.find('#autos_kraftstoff').html(json_autos[i].kraftstoff);
                new_panel.find('#autos_farbe').html(json_autos[i].farbe);
                new_panel.find('#autos_baurart').html(json_autos[i].bauart);
                new_panel.find('#autos_tank').html(json_autos[i].betankungen);
                $('.clickable', new_panel).each(function () {
                    $(this).html(function () {
                        return $(this)[0].outerHTML.replace('{{id}}', json_autos[i].id);
                    });
                });


                $('#autos_liste_anzeige').append(new_panel);
            }
            console.log("rendering abgeschlossen");
        }
    });

}