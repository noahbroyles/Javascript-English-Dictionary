<?php

require "include/Database.php";
require "include/creds.php";

try {
    $db = new Database($DB_HOST, $DB_USER, $DB_PASSWORD, $DB_NAME);
} catch (Exception $e) {
    die($e);
}
