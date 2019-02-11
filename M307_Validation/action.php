<?php
// Defaultwerte
$email = 'hilber.yannick@gmail.com';
$name = 'Yannick';
$passwort = 'asdfjklöqweruiop';
$html = '<span>Hallo Welt</span><br>';
$datum = '2018-04-02';
$tankungen = 5;
$boolean = true;

// Mit Formulardaten überschreiben
extract($_POST);

$error = "";

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $error = "Email invalid";
}

if (empty($name)) {
    $error = "Name nicht ausgefüllt";
}

if (strlen($passwort) < 8) {
    $error = "Passwort ist zu kurz";
}

if (!is_numeric($tankungen)) {
    $error = "Tankungen ungültig";
}

if (!preg_match("/<(.*)>/", $html)) {
    $error = "HTML enthält kein HTML";
}

if (!preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/", $datum)) {
    $error = "Datum invalid";
}



if(empty($error)) {
    echo json_encode([
        "success" => true,
        "error" => ""
    ]);
} else {
    echo json_encode([
        "success" => false,
        "error" => $error
    ]);
}