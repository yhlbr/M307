<?php
define('MYSQL_HOST', "localhost");
define('MYSQL_USER', "root");
define('MYSQL_PW', "");
define('MYSQL_DB', "yannickh_noten");

// Verbindung zur DB herstellen
$con = new mysqli(MYSQL_HOST, MYSQL_USER, MYSQL_PW);

// DB Überprüfen
if (!$con->select_db(MYSQL_DB)) {
    $res = createDB();
    if (!$res) {
        sendResponse(false, [], 'Datenbank konnte nicht erstellt werden');
        exit;
    }
    $con->select_db(MYSQL_DB);
}

// Ist im Browser in der Adressleiste eine GET - Vaiable mit dem Namen action?
if (isset($_GET['action'])) {
    // GET - Variable mit dem Namen action auslesen und in $switch speichern
    $switch = $_GET['action'];
} else {
    // Standard - Wert setzten
    $switch = 'get';
}

if (isset($_GET['id']) && !is_numeric($_GET['id'])) {
    sendResponse(false, [], 'ID ist nicht numerisch.');
    exit;
}

// ----------------------------------
// Switch für die action
// ----------------------------------
switch ($switch) {
    case 'get':
        $data = getData('SELECT * FROM noten', $error);
        if ($data === false) {
            sendResponse(false, [], 'Daten konnten nicht ausgelesen werden.', $error);
        } else {
            sendResponse(true, $data);
        }
        break;
    case 'getByID':
        $data = getData('SELECT * FROM noten WHERE id = ' . $_GET['id'], $error)[0];
        if ($data === false) {
            sendResponse(false, [], 'Daten konnten nicht ausgelesen werden.', $error);
        } else {
            sendResponse(true, $data);
        }
        break;
    case 'getAVG':
        $stmt = $con->prepare('SELECT AVG(note) as avg FROM noten WHERE fach = ? GROUP BY fach');
        $stmt->bind_param('s', $_GET['fach']);
        $stmt->execute();
        $res = $stmt->get_result();
        $row = $res->fetch_assoc();
        if (!$res) {
            sendResponse(false, [], 'Daten konnten nicht ausgelesen werden.');
        } else {
            sendResponse(true, ['avg' => round($row['avg'], 2)]);
        }
        break;
    case 'delete':
        $result = $con->query('DELETE FROM noten WHERE id = ' . $_GET['id']);
        if (!$result) {
            sendResponse(false, [], 'Eintrag konnte nicht gelöscht werden.', $con->error);
        } else {
            sendResponse(true);
        }
        break;
    case 'update':
        $data = $_POST;
        if (validateData($data) !== true) {
            sendResponse(false, [], validateData($data));
        } else {
            $stmt = $con->prepare("UPDATE noten
            SET fach = ?, note = ?, datum = ?
            WHERE id = " . $_GET['id']);
            $stmt->bind_param(
                'sss',
                $data['fach'],
                $data['note'],
                $data['datum']
            );
            $res = $stmt->execute();
            if (!$res) {
                sendResponse(false, [], 'Eintrag konnte nicht aktualisiert werden.', $stmt->error);
            } else {
                sendResponse(true);
            }
        }
        break;
    case "insert":
        $data = $_POST;
        if (validateData($data) !== true) {
            sendResponse(false, [], validateData($data));
        } else {
            $stmt = $con->prepare('INSERT INTO noten(fach, note, datum) VALUES (?, ?, ?)');
            $stmt->bind_param(
                'sss',
                $data['fach'],
                $data['note'],
                $data['datum']
            );
            $res = $stmt->execute();
            if (!$res) {
                sendResponse(false, [], 'Eintrag konnte nicht hinzugefügt werden.', $stmt->error);
            } else {
                sendResponse(true);
            }
        }
        break;
    case "tanken":
        $result = $con->query('UPDATE autos SET betankungen = betankungen + 1 WHERE id = ' . $_GET['id']);
        if (!$result) {
            sendResponse(false, [], 'Note konnte nicht betankt werden.', $con->error);
        } else {
            sendResponse(true);
        }
        break;
}

function sendResponse($success, $data = [], $error = "", $debug_msg = "")
{
    echo json_encode([
        "success" => $success,
        "data" => $data,
        "error" => $error,
        "debug_msg" => $debug_msg
    ]);
}

function validateData($data)
{
    if (empty($data['fach'])) {
        return 'Fach ist nicht ausgefüllt.';
    }
    if (empty($data['note'])) {
        return 'Note ist nicht ausgefüllt.';
    }
    if (empty($data['datum'])) {
        return 'Datum ist nicht ausgefüllt.';
    }
    if (!preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/", $data['datum'])) {
        return "Datum ist nicht korrekt formatiert.";
    }

    return true;
}

function getData($query, &$debug_msg = "")
{
    global $con;
    $result = $con->query($query);
    if (!$result) {
        $debug_msg = $con->error;
        return false;
    }
    return $result->fetch_all(MYSQLI_ASSOC);
}

function createDB()
{
    // DB existiert nicht, also neu erstellen
    $con = new mysqli(MYSQL_HOST, MYSQL_USER, MYSQL_PW);
    $createdb = "CREATE DATABASE IF NOT EXISTS " . MYSQL_DB . " DEFAULT CHARACTER SET utf8";
    $res_db = $con->query($createdb);
    if (!$res_db) {
        return false;
    }

    // Datenbank auswählen
    if (!$con->select_db(MYSQL_DB)) return false;

    // Tabelle erstellen
    $sql = 'CREATE TABLE IF NOT EXISTS noten (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    fach TEXT,
    note FLOAT,
    datum DATE)';
    $res_table = $con->query($sql);
    if (!$res_table) {
        return false;
    }

    // Auto einfuegen
    $sql = "INSERT INTO noten (fach, note, datum) VALUES
    ('Mathe', 5.5, '2018-06-27'),
    ('Geschichte', 4.3, '2018-03-13'),
    ('Mathe', 4.5, '2018-08-13')";
    $res_insert = $con->query($sql);
    if (!$res_insert) {
        return false;
    }

    return true;
}