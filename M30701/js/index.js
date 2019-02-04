$(function () {
    $.info("Seite geladen");
    $('#load').click(function () {
        $.ajax({
            url: 'http://www.colr.org/json/colors/random/3',
            dataType: 'json',
            success: function (data) {
                $.info("Farben erhalten");
                $.info(data);
                for (var idx in data.colors) {
                    var color = data.colors[idx].hex;
                    var el = document.createElement('p');
                    $(el).text(color).css({
                        color: '#' + color
                    });
                    $('#colors').append(el);
                }
            }
        });
    });
    $('#clear').click(function () {
        $('#colors').empty();
    });
});

$.extend({
    info: function (value) {
        console.log(value);
    }
});