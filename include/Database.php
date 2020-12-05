<?php


class DBResult {

    private $queryResults;

    function __construct($data) {
        $this->queryResults = $data;
    }

    function fetchAll() {
        return $this->queryResults;
    }

    function fetchOne() {
        return $this->queryResults[0];
    }
}


class Database {

    private $mysqliConnection;

    public function __construct($host, $user, $password, $dbname) {
        $this->mysqliConnection = mysqli_connect($host, $user, $password, $dbname);
        $this->mysqliConnection->autocommit(true);
        if ($this->mysqliConnection->connect_error) {
            throw new Exception("Database Connection Failed", 69);
        }
    }

    public function query($sql, $parameters = []) {
        if (!$parameters) {
            // There are no parameters, no possibilities of SQL injection, so just enjoy simple life
            $res = $this->mysqliConnection->query($sql);
        } else {
            $stmt = $this->mysqliConnection->prepare($sql);
            $types = "";
            foreach ($parameters as $p) {
                $type = gettype($p);
                switch ($type) {
                    case "string":
                        $types .= "s";
                        break;
                    case "integer":
                        $types .= "i";
                        break;
                    case "double":
                        $types .= "d";
                        break;
                }
            }
            $stmt->bind_param($types, ...$parameters);
            $stmt->execute();
            $res = $stmt->get_result();
            $stmt->close();
        }
        $data = [];
        if (!empty($res)) {
            while ($row = mysqli_fetch_assoc($res)) {
                $data[] = $row;
            }
            mysqli_free_result($res);
            return $data;
        }
        // return new DBResult($data);
    }

    public function close() {
        $this->mysqliConnection->close();
    }
}
