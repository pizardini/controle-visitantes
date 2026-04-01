<?php

$env = parse_ini_file(".env");

define('DB_HOST', $env['MYSQL_HOST']);   // Endereço do servidor MySQL
define('DB_NAME', $env['MYSQL_DATABASE']);  // Nome do banco de dados MySQL
define('DB_USER', $env['MYSQL_USER']);        // Usuário do banco de dados
define('DB_PASS', $env['MYSQL_PASS']);            // Senha do banco de dados
define('DB_PORT', $env['MYSQL_PORT']);            // Porta do banco de dados

function getConexao() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

    if ($conn->connect_error) {
        die("Erro de conexão: " . $conn->connect_error);
    }

    $conn->set_charset("utf8mb4");
    return $conn;
}