$(function () {
    $('.datepicker').datepicker({
        format: 'dd.mm.yyyy',
        container: 'body'
    });

    $('select').formSelect();

    $('.timepicker').timepicker({
        twelveHour: false
    });

    setContents();
    initValidator();
});

function setContents() {

    $('#first_name').val('Yannick');
    $('#last_name').val('Hilber');
    $('#password').val('100%fakeasdffdsa');
    $('#email').val('hilber.yannick@gmail.com');
    $('#first_name_icon').val('Yannick :)');
    $('#userid').val('007');
    $('#area').val('Lorem ipsum dolor sit amet, consectetur adipisicing elit. ');

    $('#checkbox1').prop('checked', true);

    $('#select').val('2');
    // Select aktualisieren
    $('select').formSelect();

    $('#date').val('27.04.2015');
    M.Datepicker.getInstance($('#date')).setDate(new Date('04-27-2015'));

    $('#timepicker').val('12:00');
    $('#radio_yellow').prop('checked', true);

    // Textfelder updaten
    M.updateTextFields();
}

function initValidator() {
    var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    // Beim eingeben und Fokusverlust setzen, Fokusverlust, da ansonsten von Materialize wieder ueberschrieben
    $('#password').on('keyup focusout', function () {
        if (!format.test($('#password').val()) || $('#password').val().length < 10) {
            $('#password').addClass('invalid');
            $('#password').removeClass('valid');
        } else {
            $('#password').addClass('valid');
            $('#password').removeClass('invalid');
            // Valid einstellen
            $('#password')[0].setCustomValidity("");
        }
    });

    $('#form').submit(function (e) {
        e.preventDefault();
        if (!format.test($('#password').val()) || $('#password').val().length < 10) {
            $('#password').addClass('invalid');
            $('#password').removeClass('valid');
            $('#password')[0].setCustomValidity("10 Zeichen und mindestens ein Sonderzeichen erforderlich.");
            $('#password')[0].reportValidity();
            return false;
        }

        readValues();
    });
}

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
    data['date'] = M.Datepicker.getInstance($('#date')).date.toISOString();
    console.log(data);
}