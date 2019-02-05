$(function () {
    $('.parallax').parallax();

    $('#mobile-menu').sidenav();

    $('select').formSelect();

    $('.modal').modal();
    M.Modal.getInstance($('.modal')[0]).open();
});
