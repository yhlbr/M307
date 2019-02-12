<?php
$config = include('config.inc.php');

// Verbindung zur DB herstellen
$con = new mysqli($config['host'], $config['user'], $config['pw']);
$con->set_charset('utf8');

// DB Überprüfen
if (!$con->select_db($config['db'])) {
    $res = createDB();
    if (!$res) {
        sendResponse(false, [], 'Datenbank konnte nicht erstellt werden');
        exit;
    }
    $con->select_db($config['db']);
}

// Ist im Browser in der Adressleiste eine GET - Vaiable mit dem Namen action?
if (isset($_GET['action'])) {
    // GET - Variable mit dem Namen action auslesen und in $switch speichern
    $switch = $_GET['action'];
} else {
    // Standard - Wert setzten
    $switch = 'get';
}

// Fehler bei falscher ID
if (isset($_GET['id']) && !is_numeric($_GET['id'])) {
    sendResponse(false, [], 'ID ist nicht numerisch');
    exit;
}

// ----------------------------------
// Switch für die action
// ----------------------------------
switch ($switch) {
    case 'get':
        $data = query('SELECT * FROM yannick_bestellung', $error);
        if ($data === false) {
            sendResponse(false, [], 'Daten konnten nicht ausgelesen werden.', $error);
        } else {
            sendResponse(true, $data);
        }
        break;
    case 'getByID':
        $data = query('SELECT * FROM yannick_bestellung WHERE bestellung_id = ' . intval($_GET['id']), $error)[0];
        if ($data === false || $data === NULL) {
            sendResponse(false, [], 'Daten konnten nicht ausgelesen werden.', $error);
        } else {
            sendResponse(true, $data);
        }
        break;
    case 'delete':
        $result = query('DELETE FROM yannick_bestellung WHERE bestellung_id = ' . $_GET['id'], $error);
        if (!$result) {
            sendResponse(false, [], 'Bestellung konnte nicht gelöscht werden.', $error);
        } else {
            sendResponse(true);
        }
        break;
    case 'update':
        $data = $_POST;
        $valid = validateData($data, $error);
        if ($valid !== true) {
            sendResponse(false, [], $error);
        } else {
            $result = prepared_query("UPDATE yannick_bestellung
            SET bestellung_artikel = ?, bestellung_menge = ?, bestellung_preis_pro_stueck = ?, bestellung_kaufdatum = ?, bestellung_bemerkung = ?
            WHERE bestellung_id = " . $_GET['id'],
                'sidss',
                [
                    $data['bestellung_artikel'],
                    $data['bestellung_menge'],
                    $data['bestellung_preis_pro_stueck'],
                    $data['bestellung_kaufdatum'],
                    $data['bestellung_bemerkung']
                ],
                $error
            );
            if (!$result) {
                sendResponse(false, [], 'Bestellung konnte nicht aktualisiert werden.', $error);
            } else {
                sendResponse(true);
            }
        }
        break;
    case "insert":
        $data = $_POST;
        $valid = validateData($data, $error);
        if ($valid !== true) {
            sendResponse(false, [], $error);
        } else {
            $result = prepared_query('INSERT INTO yannick_bestellung(bestellung_artikel, bestellung_menge, bestellung_preis_pro_stueck, bestellung_kaufdatum, bestellung_bemerkung) VALUES (?, ?, ?, ?, ?)',
                'sidss',
                [
                    $data['bestellung_artikel'],
                    $data['bestellung_menge'],
                    $data['bestellung_preis_pro_stueck'],
                    $data['bestellung_kaufdatum'],
                    $data['bestellung_bemerkung']
                ],
                $error
            );
            if (!$result) {
                sendResponse(false, [], 'Bestellung konnte nicht hinzugefügt werden.', $error);
            } else {
                sendResponse(true);
            }
        }
        break;
}

// Gibt die JSON-Daten aus
function sendResponse($success, $data = [], $error = "", $debug_msg = "")
{
    echo json_encode([
        "success" => $success,
        "data" => $data,
        "error" => $error,
        "debug_msg" => $debug_msg
    ]);
}

// Validiert die Daten
function validateData(&$data, &$error = "")
{
    if (empty($data['bestellung_artikel'])) {
        $error = 'Artikel ist nicht ausgefüllt';
        return false;
    }

    if (empty($data['bestellung_menge']) && $data['bestellung_menge'] != 0) {
        $error = 'Bestellmenge ist nicht ausgefüllt';
        return false;
    }

    // Ganzzahl prüfen
    if (filter_var($data['bestellung_menge'], FILTER_VALIDATE_INT) === false) {
        $error = 'Menge ist keine Ganzzahl';
        return false;
    }

    // Datum prüfen wenn nicht leer
    if (!preg_match('/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/', $data['bestellung_kaufdatum']) && !empty($data['bestellung_kaufdatum'])) {
        $error = 'Datum ist nicht korrekt formatiert';
        return false;
    } else if (empty($data['bestellung_kaufdatum'])) {
        // Wenn leer heutiges Datum verwenden
        $data['bestellung_kaufdatum'] = date('Y-m-d');
    }

    if (strlen($data['bestellung_artikel']) > 255) {
        $error = "Die Artikelbezeichnung ist zu Lange (Max. Zeichen: 255)";
        return false;
    }

    if (filter_var($data['bestellung_preis_pro_stueck'], FILTER_VALIDATE_FLOAT) === false) {
        $error = "Preis Pro Stück ist keine Fliesskommazahl";
        return false;
    }

    if ($data['bestellung_menge'] <= 0) {
        $error = "Bestellmenge muss mindestens 1 sein";
        return false;
    }

    return true;
}

function query($query, &$debug_msg = "")
{
    global $con;
    $result = $con->query($query);
    if (!$result) {
        $debug_msg = $con->error;
        return false;
    }

    // Wenn kein Resultat verfügbar
    if (is_bool($result)) return $result;

    return $result->fetch_all(MYSQLI_ASSOC);
}

function prepared_query($query, $types = '', $values = [], &$debug_msg = "")
{
    global $con;
    $stmt = $con->prepare($query);

    // Parameter binden
    if (!empty($types)) {
        $data = [];
        $data[] = &$types;
        foreach ($values as &$value) {
            $data[] = &$value;
        }
        call_user_func_array(array($stmt, 'bind_param'), $data);
    }

    // Statement ausführen
    $success = $stmt->execute();

    if (!$success) {
        $debug_msg = $stmt->error;
        return false;
    }

    // Resultat auslesen
    $res = $stmt->get_result();

    // Wenn kein Fehler aufgetreten ist und kein Resultat verfügbar
    if (is_bool($res) && $stmt->errno === 0 && $success) return true;
    // Wenn kein Resultat verfügbar, aber Fehler aufgetreten ist
    else if (is_bool($res)) return false;

    return $res->fetch_all(MYSQLI_ASSOC);
}

// Erstellt die Datenbank
function createDB()
{
    global $config;

    // DB existiert nicht, also neu erstellen
    $con = new mysqli($config['host'], $config['user'], $config['pw']);
    $con->set_charset('utf8');

    $createdb = "CREATE DATABASE IF NOT EXISTS " . $config['db'] . " DEFAULT CHARACTER SET utf8";
    $res_db = $con->query($createdb);
    if (!$res_db) {
        return false;
    }

    // Datenbank auswählen
    if (!$con->select_db($config['db'])) return false;

    // Tabelle erstellen
    $sql = "CREATE TABLE IF NOT EXISTS yannick_bestellung (
    bestellung_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    bestellung_artikel VARCHAR(255) NOT NULL,
    bestellung_menge INT NOT NULL DEFAULT 1,
    bestellung_preis_pro_stueck FLOAT NOT NULL,
    bestellung_kaufdatum DATE NOT NULL,
    bestellung_bemerkung TEXT)";
    $res_table = $con->query($sql);
    if (!$res_table) {
        return false;
    }

    // Auto einfuegen
    $sql = "INSERT INTO yannick_bestellung (bestellung_artikel, bestellung_menge, bestellung_preis_pro_stueck, bestellung_kaufdatum, bestellung_bemerkung) VALUES
    ('Apple MacBook Air 13.3\"', 1, 1199.00, '2016-01-01', ''),
    ('Apple Magic Mouse 2', 2, 79.00, '2017-01-01', ''),
    ('Apple Thunderbolt/Ethernet', 2, 39.00, '2018-12-24', ''),
    ('Microsoft Surface Pro 3', 3, 1600.75, '2018-04-27', ''),
    ('Microsoft Studio', 2, 2909.00, '2018-11-07', 'Bestellung von Händler Max AG')";
    $res_insert = $con->query($sql);
    if (!$res_insert) {
        return false;
    }

    return true;
}