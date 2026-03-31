<?php

define('DB_HOST',   'localhost');   // Endereço do servidor MySQL
define('DB_NAME',   'visitas_db');  // Nome do banco de dados MySQL
define('DB_USER',   'root');        // Usuário do banco de dados
define('DB_PASS',   '');            // Senha do banco de dados

function getConexao() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    if ($conn->connect_error) {
        die("Erro de conexão: " . $conn->connect_error);
    }

    $conn->set_charset("utf8mb4");
    return $conn;
}
