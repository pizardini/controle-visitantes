<?php
session_start();

require_once 'config.php';

if (isset($_SESSION['logado']) && $_SESSION['logado'] === true) {
    header('Location: dashboard.php');
    exit;
}

$erro = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = trim($_POST['usuario'] ?? '');
    $senha   = $_POST['senha'] ?? '';

    if ($usuario === '' || $senha === '') {
        $erro = 'Preencha todos os campos.';
    } else {
        $conn = getConexao();
        $stmt = $conn->prepare("SELECT senha FROM usuarios WHERE usuario = ? LIMIT 1");
        $stmt->bind_param("s", $usuario);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows === 1) {
            $stmt->bind_result($hash);
            $stmt->fetch();

            if (password_verify($senha, $hash)) {
                $_SESSION['logado']  = true;
                $_SESSION['usuario'] = $usuario;
                header('Location: dashboard.php');
                exit;
            } else {
                $erro = 'Usuário ou senha incorretos.';
            }
        } else {
            $erro = 'Usuário ou senha incorretos.';
        }

        $stmt->close();
        $conn->close();
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Controle de Visitantes – Acesso</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/login.css">
</head>
<body>
    <div class="card">
        <div class="logo-area">
            <img src="img/logo-ha-rgb-comp.png" alt="Logo Hospital de Amor" class="logo-img">
            <h1>Controle de Visitantes</h1>
            <p class="subtitulo">Pesquisa Clínica – HA</p>
        </div>

        <?php if ($erro): ?>
            <div class="erro-msg">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <?= htmlspecialchars($erro) ?>
            </div>
        <?php endif; ?>

        <form method="POST" autocomplete="off">
            <div class="campo">
                <label for="usuario">Usuário</label>
                <input type="text" id="usuario" name="usuario"
                       value="<?= htmlspecialchars($_POST['usuario'] ?? '') ?>"
                       placeholder="Digite o usuário" required autofocus>
            </div>
            <div class="campo">
                <label for="senha">Senha</label>
                <input type="password" id="senha" name="senha"
                       placeholder="Digite a senha" required>
            </div>
            <button type="submit" class="btn-entrar">Entrar</button>
        </form>

        <p class="rodape">Hospital de Amor de Barretos &copy; <?= date('Y') ?></p>
    </div>
</body>
</html>
