<?php
// Ist im Browser in der Adressleiste eine GET - Vaiable mit dem Namen action?
if (isset($_GET['action'])) {
    // GET - Variable mit dem Namen action auslesen und in $switch speichern
    $switch = $_GET['action'];
} else {
    // Standard - Wert setzten
    $switch = 'getdata';
}
// ----------------------------------
// Switch für die action
// ----------------------------------
switch ($switch) {
    case "get":
        echo getData('select * from mitarbeiter');
        break;
    case "getByID":
        echo getData('select * from mitarbeiter where id = ' . $_GET['id']);
        break;
    case "detete":
        echo 'detete Auto mit der ID = ' . $_GET['id'];
        break;
    case "update":
        echo 'update Auto mit der ID = ' . $_GET['id'];
        break;
    case "insert":
        echo insertData();
        break;
    case "tanken":
        echo 'tanke Auto mit der ID = ' . $_GET['id'];
        break;
}
function getData($sql)
{
    $content = file_get_contents('personen.json');
    $arr['daten'] = json_decode($content);

    $arr['sql'] = $sql;
    $arr['error'] = $sql;
    return json_encode($arr);
}

function insertData()
{
    $data = $_POST;

    if(!validate_data($data, $error)) {
        return json_encode(["erfolg" => false, "error" => $error]);
    }

    $content = json_decode(file_get_contents('personen.json'), true);
    $content[] = $data;
    file_put_contents('personen.json', json_encode($content));
    return json_encode(["erfolg" => true, "daten" => $content]);
}

function validate_data($data, &$error) {
    if(empty($data['name'])) {
        $error = 'Name ist nicht ausgefüllt.';
        return false;
    }
    if(strlen($data['name']) < 2) {
        $error = 'Name muss mindestens 2 Zeichen entsprechen.';
        return false;
    }
    if(empty($data['alter']) && $data['alter'] !== "0") {
        $error = 'Alter ist nicht ausgefüllt.';
        return false;
    }
    if(!is_numeric($data['alter'])) {
        $error = 'Alter ist nicht numerisch.';
        return false;
    }
    if($data['alter'] <= 0) {
        $error = 'Alter ist kleiner oder gleich 0.';
        return false;
    }

    return true;
}