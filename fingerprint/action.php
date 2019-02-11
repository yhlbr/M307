<?php
define('MYSQL_HOST', "localhost");
define('MYSQL_USER', "root");
define('MYSQL_PW', "");
define('MYSQL_DB', "yannickh_fingerprint");

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
    case 'get_accounts':
        $data = getData('SELECT * FROM accounts', $error);
        if ($data === false) {
            sendResponse(false, [], 'Daten konnten nicht ausgelesen werden.', $error);
        } else {
            sendResponse(true, $data);
        }
        break;
    case 'get_account':
        $data = getData('SELECT * FROM accounts WHERE id = ' . intval($_GET['id']), $error);
        if ($data === false) {
            sendResponse(false, [], 'Daten konnten nicht ausgelesen werden.', $error);
        } else {
            sendResponse(true, $data[0]);
        }
        break;
    case 'delete_account':
        $result = $con->query('DELETE FROM accounts WHERE id = ' . $_GET['id']);
        if (!$result) {
            sendResponse(false, [], 'Eintrag konnte nicht gelöscht werden.', $con->error);
        } else {
            sendResponse(true);
        }
        break;
    case "add_account":
        $data = $_POST;
        if (validateData($data) !== true) {
            sendResponse(false, [], validateData($data));
        } else {
            $stmt = $con->prepare('INSERT INTO accounts(vorname, nachname, email) VALUES(?, ?, ?)');
            $stmt->bind_param(
                'sss',
                $data['vorname'],
                $data['nachname'],
                $data['email']
            );
            $res = $stmt->execute();
            if (!$res) {
                sendResponse(false, [], 'Eintrag konnte nicht hinzugefügt werden.', $stmt->error);
            } else {
                sendResponse(true);
            }
        }
        break;
    case 'add_fingerprint':
        $data = $_POST;
        if (empty($data['id']) || empty($data['fingerprint'])) {
            sendResponse(false, [], "Nicht alle Angaben vorhanden.");
        } else {
            $stmt = $con->prepare('INSERT INTO accounts(acc_id, fingerprint_id) VALUES(?, ?)');
            $stmt->bind_param(
                'is',
                $data['id'],
                $data['fingerprint']
            );
            $res = $stmt->execute();
            if (!$res) {
                sendResponse(false, [], 'Eintrag konnte nicht hinzugefügt werden.', $stmt->error);
            } else {
                sendResponse(true);
            }
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
    if (empty($data['vorname'])) {
        return 'Auto-Name ist nicht ausgefüllt.';
    }
    if (empty($data['nachname'])) {
        return 'Kraftstoff ist nicht ausgefüllt.';
    }
    if (empty($data['email'])) {
        return 'Bauart ist nicht ausgefüllt.';
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
    $sql = 'CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
        vorname TEXT,
        nachname TEXT,
        email TEXT
    );';
    $res_table = $con->query($sql);

    if (!$res_table) {
        return false;
    }

    // Tabelle erstellen
    $sql = 'CREATE TABLE IF NOT EXISTS acc_fingerprints (
        id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
        acc_id INTEGER,
        fingerprint_id TEXT,
        FOREIGN KEY (acc_id) REFERENCES accounts(id)
    );';
    $res_table = $con->query($sql);

    if (!$res_table) {
        return false;
    }


    // Auto einfuegen
    /*    $sql = "INSERT INTO autos (autoname, kraftstoff, farbe, bauart, betankungen) VALUES
        ('Mercedes Benz', 'Benzin', '#000000', 'Sportwagen', 5),
        ('BMW', 'Diesel', '#0000ff', 'Cabrio', 1),
        ('Lamborghini', 'Benzin', '#ff0000', 'Sportwagen', 7),
        ('Hummer', 'Ethanol', '#ffffff', 'Limousine', 3)";
        $res_insert = $con->query($sql);
        if (!$res_insert) {
            return false;
        }*/

    return true;
}