-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 12. Feb 2019 um 15:03
-- Server-Version: 10.1.37-MariaDB
-- PHP-Version: 7.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `m307_yannick`
--
DROP DATABASE IF EXISTS `m307_yannick`;
CREATE DATABASE IF NOT EXISTS `m307_yannick` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `m307_yannick`;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `yannick_bestellung`
--

CREATE TABLE `yannick_bestellung` (
  `bestellung_id` int(11) NOT NULL,
  `bestellung_artikel` varchar(255) NOT NULL,
  `bestellung_menge` int(11) NOT NULL DEFAULT '1',
  `bestellung_preis_pro_stueck` float NOT NULL,
  `bestellung_kaufdatum` date NOT NULL,
  `bestellung_bemerkung` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `yannick_bestellung`
--

INSERT INTO `yannick_bestellung` (`bestellung_id`, `bestellung_artikel`, `bestellung_menge`, `bestellung_preis_pro_stueck`, `bestellung_kaufdatum`, `bestellung_bemerkung`) VALUES
(1, 'Apple MacBook Air 13.3\"', 1, 1199, '2016-01-01', NULL),
(2, 'Apple Magic Mouse 2', 2, 79, '2017-01-01', NULL),
(3, 'Apple Thunderbolt/Ethernet', 2, 39, '2018-12-24', NULL),
(4, 'Microsoft Surface Pro 3', 3, 1600.75, '2018-04-27', NULL),
(5, 'Microsoft Studio', 2, 2909, '2018-11-07', NULL);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `yannick_bestellung`
--
ALTER TABLE `yannick_bestellung`
  ADD PRIMARY KEY (`bestellung_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `yannick_bestellung`
--
ALTER TABLE `yannick_bestellung`
  MODIFY `bestellung_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
