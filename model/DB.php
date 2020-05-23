<?php
session_start();
class DB
{
    protected $conn;
    protected $serverName = "localhost";
    protected $userName = "root";
    protected $password = "";
    protected $dbName = "testsv";

    function __construct()
    {
        $this->conn = new mysqli($this->serverName, $this->userName, $this->password, $this->dbName);
        if ($this->conn->connect_error) {
            die("Không kết nối :" . $this->conn->connect_error);
            exit();
        }
    }
}
