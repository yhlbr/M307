$(function () {
    $('.parallax').parallax();
    $('#mobile-menu').sidenav();
    $('select').formSelect();
    $('.modal').modal();

    $('#modal_add').submit(function (e) {
        e.preventDefault();
        var valid = true;
        if (!$('#kraftstoff').val()) {
            $('#kraftstoff_error').text("Bitte Kraftstoff angeben.");
            valid = false;
        } else {
            $('#kraftstoff_error').text("");
        }

        if (!$('#bauart').val()) {
            $('#bauart_error').text("Bitte Bauart angeben.");
            valid = false;
        } else {
            $('#bauart_error').text("");
        }
        if(!valid) return;

        var values = $(this).serializeArray();
        console.log(values, 'Speichern');
    });
});