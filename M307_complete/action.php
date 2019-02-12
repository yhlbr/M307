<?php
$config = include('config.inc.php');

// Verbindung zur DB herstellen
$con = new mysqli($config['host'], $config['user'], $config['pw']);

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
        $data = query('SELECT * FROM autos', $error);
        if ($data === false) {
            sendResponse(false, [], 'Daten konnten nicht ausgelesen werden.', $error);
        } else {
            sendResponse(true, $data);
        }
        break;
    case 'getByID':
        $data = query('SELECT * FROM autos WHERE id = ' . intval($_GET['id']), $error)[0];
        if ($data === false) {
            sendResponse(false, [], 'Daten konnten nicht ausgelesen werden.', $error);
        } else {
            sendResponse(true, $data);
        }
        break;
    case 'delete':
        $result = query('DELETE FROM autos WHERE id = ' . $_GET['id'], $error);
        if (!$result) {
            sendResponse(false, [], 'Eintrag konnte nicht gelöscht werden.', $error);
        } else {
            sendResponse(true);
        }
        break;
    case 'update':
        $data = $_POST;
        if (validateData($data) !== true) {
            sendResponse(false, [], validateData($data));
        } else {
            $result = prepared_query("UPDATE autos
            SET autoname = ?, kraftstoff = ?, bauart = ?, farbe = ?
            WHERE id = " . $_GET['id'],
                'ssss',
                [
                    $data['autoname'],
                    $data['kraftstoff'],
                    $data['bauart'],
                    $data['farbe']
                ],
                $error
            );
            if (!$result) {
                sendResponse(false, [], 'Eintrag konnte nicht aktualisiert werden.', $error);
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
            $result = prepared_query('INSERT INTO autos(autoname, kraftstoff, farbe, bauart) VALUES(?,? ,? ,?)',
                'ssss',
                [
                    $data['autoname'],
                    $data['kraftstoff'],
                    $data['farbe'],
                    $data['bauart']
                ],
                $error
            );
            if (!$result) {
                sendResponse(false, [], 'Eintrag konnte nicht hinzugefügt werden.', $error);
            } else {
                sendResponse(true);
            }
        }
        break;
    case "tanken":
        $result = query('UPDATE autos SET betankungen = betankungen + 1 WHERE id = ' . $_GET['id'], $error);
        if (!$result) {
            sendResponse(false, [], 'Auto konnte nicht betankt werden.', $error);
        } else {
            sendResponse(true);
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
function validateData($data)
{
    if (empty($data['autoname'])) {
        return 'Auto-Name ist nicht ausgefüllt';
    }
    if (empty($data['kraftstoff'])) {
        return 'Kraftstoff ist nicht ausgefüllt';
    }
    if (empty($data['bauart'])) {
        return 'Bauart ist nicht ausgefüllt';
    }
    if (empty($data['farbe'])) {
        return 'Farbe ist nicht ausgefüllt';
    }

    if (!preg_match('/^#[a-f0-9]{6}$/i', $data['farbe'])) {
        return "Farbe ist nicht gültig.";
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
    $createdb = "CREATE DATABASE IF NOT EXISTS " . $config['db'] . " DEFAULT CHARACTER SET utf8";
    $res_db = $con->query($createdb);
    if (!$res_db) {
        return false;
    }

    // Datenbank auswählen
    if (!$con->select_db($config['db'])) return false;

    // Tabelle erstellen
    $sql = 'CREATE TABLE IF NOT EXISTS autos (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    autoname TEXT,
    kraftstoff TEXT,
    farbe TEXT,
    bauart TEXT,
    betankungen INTEGER NOT NULL DEFAULT 0)';
    $res_table = $con->query($sql);
    if (!$res_table) {
        return false;
    }

    // Auto einfuegen
    $sql = "INSERT INTO autos (autoname, kraftstoff, farbe, bauart, betankungen) VALUES
    ('Mercedes Benz', 'Benzin', '#000000', 'Sportwagen', 5),
    ('BMW', 'Diesel', '#0000ff', 'Cabrio', 1),
    ('Lamborghini', 'Benzin', '#ff0000', 'Sportwagen', 7),
    ('Hummer', 'Ethanol', '#ffffff', 'Limousine', 3)";
    $res_insert = $con->query($sql);
    if (!$res_insert) {
        return false;
    }

    return true;
}