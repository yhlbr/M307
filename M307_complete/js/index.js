$(function () {
    $('.parallax').parallax();
    $('#mobile-menu').sidenav();
    $('select').formSelect();
    $('.modal').modal();

    $('#modal_add').submit(function (e) {
        e.preventDefault();
        var values = getFormValues($(this));
        console.log(values);

    });
});

function getFormValues(subject) {
    // Werte holen und umformen
    var values = $(subject).serializeArray();
    var data = {};
    for (var i = 0; el = values[i]; i++) {
        data[el.name] = el.value;
    }

    // Checkboxen konvertieren
    $('input[type="checkbox"]', subject).each(function () {
        if ($(this).is(':checked')) {
            data[this.name] = true;
        } else {
            data[this.name] = false;
        }
    });

    // Datum konvertieren
    $('.datepicker', subject).each(function() {
        data[this.name] = M.Datepicker.getInstance($(this)).date.toISOString();
    });

    return data;
}