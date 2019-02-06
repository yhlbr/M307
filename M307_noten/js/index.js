var tpl_list;
var tpl_avg;

$(function () {
    $('.datepicker').datepicker({
        format: 'dd.mm.yyyy',
        container: 'body'
    });
    $('.parallax').parallax();
    $('#mobile-menu').sidenav();
    $('select').formSelect();
    $('.modal').modal();

    $('#btn_add').click(function () {
        $('#modal').data('action', 'insert');
        clear_modal();
    });

    init_modal();
    $('.datepicker', $('#modal')).focus(function () {
        var picker = M.Datepicker.getInstance(this);
        if (!picker.isOpen) {
            picker.open();
        }
    });

    init_schnitte();
    init_list();
});

function clear_modal() {
    // Inputs leeren
    $('#modal :input').val('').removeClass('invalid').removeClass('valid');
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
        var values = {};
        var date = M.Datepicker.getInstance($('#datum')).date;
        values.datum = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
        values.note = $('#note').val();
        values.fach = $('#fach').val();
        console.log(values, 'Speichern');

        // Anfrage wählen (update oder insert)
        var suffix = '';
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
                    M.toast({html: "Note gespeichert.", classes: 'green'});
                    M.Modal.getInstance($modal).close();
                    clear_modal();
                } else {
                    M.toast({html: "Fehler: " + response.error, classes: 'red'});
                    console.log(response.debug_msg);
                }
                // Tabelle aktualisieren
                load_table();
            },
            complete: function () {
                console.log(arguments);
            }
        });
    });
}

function init_list() {
    // Vorlagerow zwischenspeichern und anschliessend entfernen
    var $tpl = $('#noten_liste_template');
    $tpl.show();
    tpl_list = $tpl.clone();
    $tpl.hide();

    // Tabelle leeren
    var $anzeige = $('#noten_liste_anzeige');
    $anzeige.html('');

    // Tabelle befüllen
    load_table();
}

function load_table() {
    var $anzeige = $('#noten_liste_anzeige');

    $anzeige.html('');
    $.ajax({
        url: 'action.php?action=get',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            // Bei Fehler nicht fortfahren und Fehler ausgeben
            if (!response.success) {
                M.toast({html: "Fehler: " + response.error, classes: 'red'});
                console.log(response.debug_msg);
                return;
            }
            // Alle Autos durchgehen
            var json_noten = response.data;
            for (var i = 0; i < json_noten.length; i++) {
                // Datum aufbereiten
                json_noten[i].datum = new Date(json_noten[i].datum).toLocaleDateString();
                // Row erstellen und Daten einfüllen
                var new_panel = tpl_list.clone();
                var html_for_mustache = new_panel[0].outerHTML;
                var html = Mustache.to_html(html_for_mustache, json_noten[i]);

                // An Tabelle anhängen
                $anzeige.append(html);
            }

            $('.btn_avg', $anzeige).click(function () {
                var name = $(this).parents('tr').find('.td_fach').text();
                $.ajax({
                    url: 'action.php?action=getAVG&fach=' + name,
                    type: 'GET',
                    dataType: 'json',
                    success: function (response) {
                        console.log(response);
                        // Bei Fehler abbrechen
                        if (!response.success) {
                            M.toast({html: 'Fehler: ' + response.error, classes: 'red'});
                            console.log(response.debug_msg);
                            return;
                        }
                        M.toast({html: "Schnitt: " + response.data.avg});
                    },
                    complete: function () {
                        console.log(arguments);
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
                            M.toast({html: 'Fehler: ' + response.error, classes: 'red'});
                            console.log(response.debug_msg);
                            return;
                        }

                        var data = response.data;
                        var $modal = $('#modal');

                        // Modal befüllen
                        clear_modal();
                        $('#fach').val(data.fach);
                        $('#note').val(data.note);

                        $('#datum').val(new Date(data.datum).toLocaleDateString());
                        M.Datepicker.getInstance($('#datum')).setDate(new Date(data.datum));

                        M.updateTextFields();
                        $('select').formSelect();
                        $modal.data('action', 'update');
                        $modal.data('id', id);

                        // Modal öffnen
                        M.Modal.getInstance($modal).open();
                    }
                });
            });
            $('.btn_delete', $anzeige).click(function () {
                // Bestätigung einfordern
                if (!confirm('Soll der Eintrag wirklich gelöscht werden?')) {
                    return;
                }

                var id = $(this).parents('tr').data('id');
                $.ajax({
                    url: 'action.php?action=delete&id=' + id,
                    type: 'GET',
                    dataType: 'json',
                    success: function (response) {
                        // Erfolgs- oder Fehlermeldung ausgeben
                        if (!response.success) {
                            M.toast({html: 'Fehler: ' + response.error, classes: 'red'});
                            console.log(response.debug_msg);
                        } else {
                            M.toast({html: 'Eintrag gelöscht', classes: 'green'});
                        }
                        load_table();
                    }
                });
            });
        }
    });

    show_schnitte();
}

function show_schnitte() {
    $.ajax({
        url: 'action.php?action=allAVGs',
        dataType: 'json',
        type: 'get',
        success: function (response) {
            $('#schnitt_liste_anzeige').empty();
            for (var i in response.data) {
                var new_panel = tpl_avg.clone();
                var html_for_mustache = new_panel[0].outerHTML;
                var html = Mustache.to_html(html_for_mustache, response.data[i]);
                $('#schnitt_liste_anzeige').append(html);
            }
        }
    })
}

function init_schnitte() {
    tpl_avg = $('#schnitt_liste_template').clone();
    $('#schnitt_liste_template').remove();
}