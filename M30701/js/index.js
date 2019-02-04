$(function () {
    $.info("Seite geladen.");
});

$.extend({
    info: function (value) {
        console.log("Info: " + value);
    }
});