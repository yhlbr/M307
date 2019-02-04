$(function () {
    $('.datepicker').datepicker({
        format: 'dd.mm.yyyy'
    });
    $('select').formSelect();
    $('.timepicker').timepicker({
        twelveHour: false
    });
});
