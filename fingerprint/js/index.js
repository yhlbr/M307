var domainname = 'e80d71d1.ngrok.io';

$(document).ready(function () {
    $('.modal').modal();
    $('select').formSelect();

    init_modal_acc();
    init_modal_print();
});

function init_modal_acc() {
    var $modal = $('#modal_acc');
    $modal.submit(function (e) {
        e.preventDefault();
        var values = $modal.serializeArray();
        $.ajax({
            url: 'action.php?action=' + $modal.data('action'),
            type: 'POST',
            dataType: 'json',
            data: values,
            success: function (response) {
                if (!response.success) {
                    M.toast({html: "Fehler: " + response.error, classes: 'red'});
                    console.log(response.debug_msg);
                } else {
                    M.toast({html: "Erfolgreich gespeichert", classes: 'green'});
                    M.Modal.getInstance($modal).close();
                    clear_modal_acc();
                }
            }
        });
    });
    $modal.data('action', 'add_account');
}

function clear_modal_acc() {
    var $modal = $('#modal_acc');
    $(':input', $modal).val("");
    M.updateTextFields();
}

function init_modal_print() {
    var $modal = $('#modal_print');
    $modal.modal({
        onOpenStart: function () {
            $.ajax({
                url: 'action.php?action=get_accounts',
                dataType: 'json',
                type: 'get',
                success: function (response) {
                    console.log(response);
                    if (!response.success) {
                        M.toast({html: "Fehler: " + response.error});
                        console.log(response.debug_msg);
                        return;
                    }
                    for (var i in response.data) {
                        var account = response.data[i];
                        $("#sel_acc").append(new Option(account.vorname + " " + account.nachname, account.id));
                    }
                    $('select').formSelect();
                }
            });
            // $("#selectList").append(new Option("", ""));
        }
    });

    $modal.submit(function (e) {
        e.preventDefault();
        // var test = register_login();
        $.ajax({
            url: 'action.php?action=get_account&id=' + $('#sel_acc').val(),
            type: 'get',
            dataType: 'json',
            success: function (response) {
                console.log(response);
                if(response.success) {
                    register_fingerprint(response.data);
                }
                // register_fingerprint();
            }
        });
    });
}


function register_fingerprint(account) {
    // sample arguments for registration
    var createCredentialDefaultArgs = {
        publicKey: {
            // Relying Party (a.k.a. - Service):
            rp: {
                name: "M307 Fingerprint"
            },

            // User:
            user: {
                id: new Uint8Array(16),
                name: account.email,
                displayName: account.vorname + " " + account.nachname
            },

            pubKeyCredParams: [{
                type: "public-key",
                alg: -7
            }],

            attestation: "direct",

            timeout: 60000,

            challenge: new Uint8Array([ // must be a cryptographically random number sent from a server
                0x8C, 0x0A, 0x26, 0xFF, 0x22, 0x91, 0xC1, 0xE9, 0xB9, 0x4E, 0x2E, 0x17, 0x1A, 0x98, 0x6A, 0x73,
                0x71, 0x9D, 0x43, 0x48, 0xD5, 0xA7, 0x6A, 0x15, 0x7E, 0x38, 0x94, 0x52, 0x77, 0x97, 0x0F, 0xEF
            ]).buffer
        }
    };

// register / create a new credential
    navigator.credentials.create(createCredentialDefaultArgs)
        .then(function (cred) {
            console.log("NEW CREDENTIAL", cred);
            alert(new TextDecoder().decode(cred.rawId));
            $.ajax({
                url: 'action.php?action=add_fingerprint',
                type: 'POST',
                data: {
                    id: account.id,
                    fingerprint: new TextDecoder().decode(cred.rawId)
                },
                dataType: 'json',
                success: function(response) {
                    console.log(response);
                }
            });
        })
        .catch(function (err) {
            console.log("ERROR", err);
        });
}


function login_fingerprint() {
    // sample arguments for login
    var getCredentialDefaultArgs = {
        publicKey: {
            timeout: 60000,
            // allowCredentials: [newCredential] // see below
            challenge: new Uint8Array([ // must be a cryptographically random number sent from a server
                0x79, 0x50, 0x68, 0x71, 0xDA, 0xEE, 0xEE, 0xB9, 0x94, 0xC3, 0xC2, 0x15, 0x67, 0x65, 0x26, 0x22,
                0xE3, 0xF3, 0xAB, 0x3B, 0x78, 0x2E, 0xD5, 0x6F, 0x81, 0x26, 0xE2, 0xA6, 0x01, 0x7D, 0x74, 0x50
            ]).buffer
        }
    };

    // normally the credential IDs available for an account would come from a server
    // but we can just copy them from above...
    getCredentialDefaultArgs.publicKey.allowCredentials = [{
        id: crypto.getRandomValues(new Uint8Array(32)),
        type: "public-key"
    }];
    navigator.credentials.get(getCredentialDefaultArgs).then(function (value) {
        console.log(value);
    });
}

function get_login() {
    navigator.credentials.get({
        publicKey: {
            challenge: crypto.getRandomValues(new Uint8Array(32)),
            rpId: domainname,
            allowCredentials:
                [{
                    type: "public-key",
                    id: crypto.getRandomValues(new Uint8Array(80))
                }],
            userVerification: "required"
        }
    })
    ;
}

function register_login() {
    navigator.credentials.create({
        publicKey: {
            challenge: crypto.getRandomValues(new Uint8Array(32)),
            rp: {id: domainname, name: "Local Test"},
            user: {
                id: crypto.getRandomValues(new Uint8Array(8)),
                name: "test",
                displayName: "Max Muster"
            },
            pubKeyCredParams: [{type: "public-key", alg: -7}]
        }
    }).catch(function (reason) {
        if (reason.code !== 0) {
            M.toast({html: "Fehler: " + reason.message});
        }
    }).then(function (value) {
        console.log(arguments);
    });
}