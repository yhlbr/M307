// Vorlagezeile der Tabelle
var tpl_list;

$(function () {
    // Felder initialisieren
    $('.parallax').parallax();
    $('#mobile-menu').sidenav();
    $('select').formSelect();
    $('.modal').modal();

    // Hinzufügen Button
    $('#btn_add').click(function () {
        $('#modal').data('action', 'insert');
        clear_modal();
    });

    // Modal vorbereiten
    init_modal();
    // Tabelle vorbereiten
    init_list();
});

function clear_modal() {
    // Inputs leeren
    $('#modal :input').val('').removeClass('invalid').removeClass('valid');
    // Materialize aktualisieren
    M.updateTextFields();
    $('select').formSelect();

    // Fehlermeldungen entfernen
    $('#kraftstoff_error').text('');
    $('#bauart_error').text('');
}

function init_modal() {
    var $modal = $('#modal');

    // Beim Modal absenden
    $modal.submit(function (e) {
        // Absenden aufhalten
        e.preventDefault();

        // Felder, die nicht HTML5 überprüfbar sind, auswerten
        var valid = true;
        if (!$('#kraftstoff').val()) {
            $('#kraftstoff_error').text('Bitte Kraftstoff angeben');
            valid = false;
        } else {
            $('#kraftstoff_error').text('');
        }

        if (!$('#bauart').val()) {
            $('#bauart_error').text('Bitte Bauart angeben');
            valid = false;
        } else {
            $('#bauart_error').text('');
        }
        // Falls Fehler aufgekommen, nicht fortfahren
        if (!valid) return;

        // Formular auslesen
        var values = $(this).serializeArray();
        console.log(values, 'Speichern');

        // Anfrage wählen (update oder insert)
        var suffix = '';
        // Falls keine Aktion verfügbar, insert verwenden
        var action = ($modal.data('action') || 'insert');
        if (action === 'update') {
            suffix = '&id=' + $modal.data('id');
        }

        $.ajax({
            url: 'action.php?action=' + action + suffix,
            type: 'POST',
            data: values,
            dataType: 'json',
            success: function (response) {
                // Erfolg oder Fehler anzeigen
                if (response.success) {
                    $.t_success('Auto gespeichert');
                    M.Modal.getInstance($modal).close();
                    clear_modal();
                } else {
                    $.t_error(response.error);
                    console.log(response.debug_msg);
                }
                // Tabelle aktualisieren
                load_table();
            }
        });
    });
}

// Tabelle vorbereiten und Daten laden
function init_list() {
    // Vorlagerow zwischenspeichern und anschliessend entfernen
    var $tpl = $('#autos_liste_template');
    $tpl.show();
    tpl_list = $tpl.clone();
    $tpl.hide();

    // Tabelle leeren
    var $anzeige = $('#autos_liste_anzeige');
    $anzeige.html('');

    // Tabelle befüllen
    load_table();
}

// Tabellendaten laden
function load_table() {
    var $anzeige = $('#autos_liste_anzeige');

    $anzeige.html('');
    $.ajax({
        url: 'action.php?action=get',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            // Bei Fehler nicht fortfahren und Fehler ausgeben
            if (!response.success) {
                $.t_error(response.error);
                console.log(response.debug_msg);
                return;
            }
            // Alle Autos durchgehen
            var json_autos = response.data;
            for (var i = 0; i < json_autos.length; i++) {
                // Row erstellen und Daten einfüllen
                var new_panel = tpl_list.clone();
                new_panel.find('#autos_name i').css('color', json_autos[i].farbe);
                var html_for_mustache = new_panel[0].outerHTML;
                var html = Mustache.to_html(html_for_mustache, json_autos[i]);

                // An Tabelle anhängen
                $anzeige.append(html);
            }

            $('.btn_fill', $anzeige).click(function () {
                var id = $(this).parents('tr').data('id');
                $.ajax({
                    url: 'action.php?action=tanken&id=+' + id,
                    type: 'GET',
                    dataType: 'json',
                    success: function (response) {
                        // Erfolgs- oder Fehlermeldung ausgeben
                        if (!response.success) {
                            $.t_error(response.error);
                            console.log(response.debug_msg);
                        } else {
                            $.t_success('Auto betankt');
                        }
                        load_table();
                    }
                });
            });
            $('.btn_edit', $anzeige).click(function () {
                var id = $(this).parents('tr').data('id');
                $.ajax({
                    url: 'action.php?action=getByID&id=' + id,
                    type: 'GET',
                    dataType: 'json',
                    success: function (response) {
                        console.log(response);
                        // Bei Fehler abbrechen
                        if (!response.success) {
                            $.t_error(response.error);
                            console.log(response.debug_msg);
                            return;
                        }

                        var data = response.data;
                        var $modal = $('#modal');

                        // Modal befüllen
                        clear_modal();
                        $('#autoname').val(data.autoname);
                        $('#kraftstoff').val(data.kraftstoff);
                        $('#bauart').val(data.bauart);
                        $('#farbe').val(data.farbe);
                        M.updateTextFields();
                        $('select').formSelect();
                        $modal.data('action', 'update');
                        $modal.data('id', id);

                        // Modal öffnen
                        M.Modal.getInstance($modal).open();
                    }
                });
            });

            // Löschen Button binden
            $('.btn_delete', $anzeige).click(function () {
                // Bestätigung einfordern
                if (!confirm('Soll der Eintrag wirklich gelöscht werden?')) {
                    return;
                }

                // Löschvorgang
                var id = $(this).parents('tr').data('id');
                $.ajax({
                    url: 'action.php?action=delete&id=' + id,
                    type: 'GET',
                    dataType: 'json',
                    success: function (response) {
                        // Erfolgs- oder Fehlermeldung ausgeben
                        if (!response.success) {
                            $.t_error(response.error);
                            console.log(response.debug_msg);
                        } else {
                            $.t_success('Eintrag gelöscht');
                        }
                        // Tabelle neu laden
                        load_table();
                    }
                });
            });
        }
    });
}

// Helperfunktionen
$.extend({
    t_success: function (text) {
        M.toast({html: text, classes: 'green'});
    },
    t_error: function (text) {
        M.toast({html: 'Fehler: ' + text, classes: 'red'});
    }
});