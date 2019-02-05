<?php
$errors = [];

if(empty($_REQUEST['first_name'])) {
    $errors[] = "Vorname ist leer";
}

if(empty($_REQUEST['last_name'])) {
    $errors[] = "Nachname ist leer";
}

if(empty($_REQUEST['password'])) {
    $errors[] = "Passwort ist leer";
}

if(strlen($_REQUEST['password']) < 10) {
    $errors[] = "Passwort ist zu kurz";
}

if(!preg_match('/[ !@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/', $_REQUEST['password'])) {
    $errors[] = "Passwort enthält kein Sonderzeichen";
}

if(!filter_var($_REQUEST['email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = "E-Mail ist nicht richtig formatiert.";
}

if(!in_array($_REQUEST['select'], ['1', '2', '3'])) {
    $errors[] = "Falscher Wert für Select";
}

if(!empty($errors)) {
    echo $errors[0];
} else {
    echo "Formular ist korrekt.";
}