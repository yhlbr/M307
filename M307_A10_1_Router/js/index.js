$(function () {
    $('.modal').modal();

    var clone = $('#tpl').clone();
    $('#tpl').remove();

    $('#get_data').click(function () {
        $.ajax({
            url: 'router.php?action=get',
            dataType: 'json',
            success: function (response) {
                console.log(response);

                $('#tbody').empty();

                for (var i = 0; el = response.daten[i]; i++) {
                    var html_for_mustache = $(clone).clone()[0].outerHTML;
                    var html = Mustache.to_html(html_for_mustache, el);
                    $('#tbody').append(html);
                }
            }
        });
    });

    $('#btn_add').click(function () {
        var request = {
            name: $('#name').val(),
            alter: $('#alter').val()
        };
        $.ajax({
            url: 'router.php?action=insert',
            data: request,
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                if (response.erfolg) {
                    M.toast({html: "Erfolgreich eingefügt!"});
                    M.Modal.getInstance($('#modal_add')).close();
                } else {
                    M.toast({html: "Fehler beim Einfügen: " + response.error});
                }
                $('#get_data').click();
            }
        })
    });

    $('#get_data').click();
});