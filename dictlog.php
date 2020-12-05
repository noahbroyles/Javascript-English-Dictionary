<?php

require "include/Database.php";
require "include/creds.php";

try {
    $db = new Database($DB_HOST, $DB_USER, $DB_PASSWORD, $DB_NAME);
} catch (Exception $e) {
    die($e);
}

if (isset($_POST["word"])) {
    $ip = $_SERVER['REMOTE_ADDR'];
    if (array_key_exists('HTTP_X_FORWARDED_FOR', $_SERVER)) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    }
    $word = htmlspecialchars(strtolower($_POST["word"]));
} else {
    die();
}

$db->query("SET time_zone = '-5:00';");
$db->query(
    "INSERT INTO tDictionary (WordLookedUp, IPAddress) VALUES (?, ?)",
    [$word, $ip]
);

$db->close();