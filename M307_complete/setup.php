<?php

define('MYSQL_HOST', "localhost");
define('MYSQL_USER', "root");
define('MYSQL_PW', "");
define('MYSQL_DB', "yannickh");
// Verbindung zur DB herstellen
$con = new mysqli(MYSQL_HOST, MYSQL_USER, MYSQL_PW);


if (!$con->select_db(MYSQL_DB)) {
    // DB existiert nicht, also neu erstellen
    $con = new mysqli(MYSQL_HOST, MYSQL_USER, MYSQL_PW);
    $createdb = "CREATE DATABASE IF NOT EXISTS " . MYSQL_DB . " DEFAULT CHARACTER SET utf8";
    $res_db = $con->query($createdb);
    if ($res_db) {
        echo "Datenbank erstellt.<br>";
    }

    // Datenbank auswählen
    $con->select_db(MYSQL_DB) or die('Datenbank nicht wählbar.');

    // Tabelle erstellen
    $sql = 'CREATE TABLE IF NOT EXISTS autos (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    autoname VARCHAR(255) NOT NULL,
    kraftstoff VARCHAR(255) NOT NULL,
    farbe VARCHAR(255) NOT NULL,
    bauart VARCHAR(255) NOT NULL,
    betankungen INTEGER NOT NULL DEFAULT 0)';
    $res_table = $con->query($sql);
    if ($res_table) {
        echo "Tabelle erstellt.<br>";
    }

    // Auto einfuegen
    $sql = "INSERT INTO autos (autoname, kraftstoff, farbe, bauart, betankungen) VALUES
    ('Mercedes Benz', 'Benzin', '#000000', 'Sportwagen', 5),
    ('BMW', 'Diesel', '#0000ff', 'Cabrio', 1),
    ('Lamborghini', 'Benzin', '#ff0000', 'Sportwagen', 7),
    ('Hummer', 'Ethanol', '#ffffff', 'Limousine', 3)";
    $res_insert = $con->query($sql);
    if ($res_insert) {
        echo "Auto eingefügt.<br>";
    }
}

$con->close();