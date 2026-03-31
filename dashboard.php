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

<link rel="stylesheet" href="style.css">

<script src="BrowserPrint-3.1.250.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>

</head>

<body>

<div class="topo">
    <h2>Controle de Visitantes – Pesquisa Clínica</h2>
    <a href="logout.php" class="btn-sair">Sair</a>
</div>

<div class="opcoes">
<div class="filtro">

<label>Data da visita:</label>
<input type="date" id="dataFiltro">

<button id="botaoAtualizar" onclick="carregar()">Atualizar lista</button>

</div>
<div class="config-impressao">

<label>Tamanho da etiqueta:</label>

<select id="tamanhoEtiqueta">
<option value="9.5x4">9,5 x 4 cm</option>
<option value="5x3">5 x 3 cm</option>
<option value="8x3">8 x 3 cm</option>
</select>

</div>
</div>

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

<script src="app.js"></script>

</body>

</html>
