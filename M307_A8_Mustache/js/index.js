(function ($) {
    $(function () {
        $.ajax({
            url: 'cars.json',
            dataType: 'json',
            success: function (json_autos) {

                // Design mit id = autos_liste_template in eine Variable laden
                $('#autos_liste_template').show();
                var panel = $('#autos_liste_template').clone();
                $('#autos_liste_template').hide();

                // fals die Auto - Liste einträge enthällt, leeren
                $('#autos_liste_anzeige').html('');

                //Mustache.parse(panel);
                for (i = 0; i < json_autos.length; i++) {
                    var new_panel = panel.clone();
                    // Tabelle farblich unterscheiden
                    if (i % 2 === 0) {
                        new_panel.find('#autotemplate').addClass('green lighten-5');
                    } else {
                        new_panel.find('#autotemplate').addClass('grey lighten-3');
                    }
                    // nur die i Elemente : Farbe vom Auto setzten anhand vom DB - Eintrag : json_autos[i].farbe
                    new_panel.find('#autos_name i').css('color', json_autos[i].farbe);
                    //console.log(json_autos[i].id);
                    //var new_panel = panel;
                    var html_for_mustache = new_panel[0].outerHTML;
                    var html = Mustache.to_html(html_for_mustache, json_autos[i]);
                    $('#autos_liste_anzeige').append(html);
                }

                $('.btn_fill').click(function () {
                    var id = $(this).parents('tr').data('id');
                    M.toast({html: 'Auto betanken mit der id: ' + id + '!', classes: 'teal darken-3'});
                });
                $('.btn_edit').click(function () {
                    var id = $(this).parents('tr').data('id');
                    M.toast({html: 'Auto bearbeiten mit der id: ' + id + '!', classes: 'teal darken-3'});
                });
                $('.btn_delete').click(function () {
                    var id = $(this).parents('tr').data('id');
                    M.toast({html: 'Auto löschen mit der id: ' + id + '!', classes: 'teal darken-3'});
                });
            }
        });
    }); // End Document Ready
})(jQuery); // End of jQuery name space