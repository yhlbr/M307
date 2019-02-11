$(function () {
    $('.datepicker').datepicker({
        format: 'dd.mm.yyyy',
        container: 'body'
    });

    $('select').formSelect();

    $('#form').submit(function (e) {
        e.preventDefault();
        var values = readValues();
        $.ajax({
            url: 'action.php',
            data: values,
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    M.toast({html: "Valid"});
                } else {
                    M.toast({html: "Fehler: " + response.error});
                }
            }
        })
    });
});

function readValues() {
    // Werte holen und umformen
    var values = $('#form').serializeArray();
    var data = {};
    for (var i = 0; el = values[i]; i++) {
        data[el.name] = el.value;
    }

    // Checkboxen konvertieren
    $('input[type="checkbox"]', '#form').each(function () {
        if ($(this).is(':checked')) {
            data[this.name] = true;
        } else {
            data[this.name] = false;
        }
    });

    // Datum konvertieren
    data['datum'] = M.Datepicker.getInstance($('#datum')).date.toISOString();
    return data;
}