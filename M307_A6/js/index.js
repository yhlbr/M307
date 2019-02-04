$(function () {
    $('.tooltipped').tooltip();

    $('#clickme').click(function () {
        console.log("Button geklickt");
    });

    $('#colorchange').click(function() {
        $('#card').addClass('blue-grey darken-1');
        $('.card-content', '#card').addClass('white-text');
    });
});

$.extend({
    info: function (value) {
        console.log(value);
    }
});