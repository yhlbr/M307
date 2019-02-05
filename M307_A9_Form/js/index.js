$(function () {
    $('.datepicker').datepicker({
        format: 'dd.mm.yyyy'
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
    $('#password').val('100%fake');
    $('#email').val('hilber.yannick@gmail.com');
    $('#first_name_icon').val('Yannick :)');

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

    $('#form').submit(function(e) {
        if (!format.test($('#password').val()) || $('#password').val().length < 10) {
            $('#password').addClass('invalid');
            $('#password').removeClass('valid');
            $('#password')[0].setCustomValidity("Mindestens ein Sonderzeichen erforderlich.");
            $('#password')[0].reportValidity();
        }
        e.preventDefault();
    });
}