// Vorlagezeile der Tabelle
var tpl_list;

$(function () {
    // Felder initialisieren
    $('.parallax').parallax();
    $('#mobile-menu').sidenav();
    $('.modal').modal();
    $('.datepicker').datepicker({
        format: 'd.m.yyyy',
        container: 'body',
        defaultDate: new Date(),
        setDefaultDate: true
    });

    // Hinzufügen Button
    $('#btn_add').click(function () {
        $('#modal').data('action', 'insert');
        // Modal leeren
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

    // Standartwert für Bestellmenge
    $('#bestellung_menge').val('1');

    M.Datepicker.getInstance($('#bestellung_kaufdatum')).setDate(new Date());

    // Materialize aktualisieren
    M.updateTextFields();
    $('select').formSelect();
}

function init_modal() {
    var $modal = $('#modal');

    // Beim Modal absenden
    $modal.submit(function (e) {
        // Absenden aufhalten
        e.preventDefault();

        // Formular auslesen
        var values = $(this).serializeArray();
        var date = M.Datepicker.getInstance($('#bestellung_kaufdatum')).date;

        // Offset der Zeitzone einberechnen
        for (var i in values) {
            if (values.hasOwnProperty(i)) {
                if (values[i].name === 'bestellung_kaufdatum') {
                    values[i].value = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
                }
            }
        }
        // console.log(values, 'Speichern');

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
                    $.t_success('Bestellung gespeichert');
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
    var $tpl = $('#bestellungen_liste_template');
    $tpl.show();
    tpl_list = $tpl.clone();
    $tpl.hide();

    // Tabelle leeren
    var $anzeige = $('#bestellungen_liste_anzeige');
    $anzeige.html('');

    // Tabelle befüllen
    load_table();
}

// Tabellendaten laden
function load_table() {
    var $anzeige = $('#bestellungen_liste_anzeige');

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
            // Alle Bestellungen durchgehen
            var json_bestellungen = response.data;
            for (var i = 0; i < json_bestellungen.length; i++) {
                // Datum formatieren
                json_bestellungen[i].bestellung_kaufdatum = new Date(json_bestellungen[i].bestellung_kaufdatum).toLocaleDateString();

                // Row erstellen und Daten einfüllen
                var new_panel = tpl_list.clone();
                var html_for_mustache = new_panel[0].outerHTML;
                var html = Mustache.to_html(html_for_mustache, json_bestellungen[i]);

                // An Tabelle anhängen
                $anzeige.append(html);
            }

            $('.btn_edit', $anzeige).click(function () {
                var id = $(this).parents('tr').data('id');
                $.ajax({
                    url: 'action.php?action=getByID&id=' + id,
                    type: 'GET',
                    dataType: 'json',
                    success: function (response) {
                        // Bei Fehler abbrechen
                        if (!response.success) {
                            $.t_error(response.error);
                            console.log(response.debug_msg);
                            return;
                        }

                        var data = response.data;
                        console.log(response);
                        var $modal = $('#modal');

                        // Modal leeren und befüllen
                        clear_modal();
                        $('#bestellung_artikel').val(data.bestellung_artikel);
                        $('#bestellung_menge').val(data.bestellung_menge);
                        $('#bestellung_preis_pro_stueck').val(data.bestellung_preis_pro_stueck);

                        // Datepicker setzen
                        var $bst_kaufdatum = $('#bestellung_kaufdatum');
                        $bst_kaufdatum.val(new Date(data.bestellung_kaufdatum).toLocaleDateString());
                        M.Datepicker.getInstance($bst_kaufdatum).setDate(new Date(data.bestellung_kaufdatum));

                        var $bst_bemerkung = $('#bestellung_bemerkung');
                        $bst_bemerkung.val(data.bestellung_bemerkung);

                        M.textareaAutoResize($bst_bemerkung);
                        M.updateTextFields();

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