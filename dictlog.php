<?php

require "include/Database.php";
require "include/creds.php";

try {
    $db = new Database($DB_HOST, $DB_USER, $DB_PASSWORD, $DB_NAME);
} catch (Exception $e) {
    die($e);
}

if (isset($_POST["ip"]) and isset($_POST["word"])) {
    $ip = str_replace("\n", "", $_POST["ip"]);
    $word = $_POST["word"];
} else {
    die();
}

$db->query("SET time_zone = '-5:00';");
$db->query(
    "INSERT INTO tDictionary (WordLookedUp, IPAddress) VALUES (?, ?)",
    [$ip, $word]
);

$db->close();