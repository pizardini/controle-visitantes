<?php
session_start();

// Bloqueia acesso sem login
if (!isset($_SESSION['logado']) || $_SESSION['logado'] !== true) {
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">

<head>

<meta charset="UTF-8">
<title>Controle de Visitantes</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">

<script src="js/BrowserPrint-3.1.250.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>

</head>

<body>

<div class="topo">
    <div class="topo-esquerda">
        <img src="img/logo-ha-rgb.png" alt="Logo Hospital de Amor" class="logo-img">
        <div>
            <h2>Controle de Visitantes</h2>
            <span class="subtitulo">Pesquisa Clínica – Hospital de Amor</span>
        </div>
    </div>
    <a href="logout.php" class="btn-sair">
        <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Sair
    </a>
</div>

<div class="conteudo">

    <div class="painel-opcoes">
        <div class="filtro">
            <label>Data da visita</label>
            <input type="date" id="dataFiltro">
        </div>
        <div><button id="botaoAtualizar" onclick="carregar()">Atualizar lista</button></div>
        <div class="config-impressao">
            <label>Tamanho da etiqueta</label>
            <select id="tamanhoEtiqueta">
                <option value="9.5x4">9,5 x 4 cm</option>
                <option value="5x3">5 x 3 cm</option>
                <option value="8x3">8 x 3 cm</option>
            </select>
        </div>
    </div>

    <div class="tabela-wrapper">
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Empresa</th>
                    <th>Setor Responsável</th>
                    <th>Período da visita</th>
                    <th>Ação</th>
                </tr>
            </thead>
            <tbody id="tabela"></tbody>
        </table>
    </div>

</div>

<script src="js/app.js"></script>

</body>

</html>