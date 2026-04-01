# Controle de Visitantes – Pesquisa Clínica
**Hospital de Amor de Barretos**

> Sistema web para controle e impressão de crachás de visitantes da Pesquisa Clínica. Desenvolvido por **Pietro Zardini** como contribuição à Pesquisa Clínica do Hospital de Amor de Barretos.

🔗 **[Visualizar demo no GitHub Pages](https://pizardini.github.io/controle-visitantes/)** *(versão estática do dashboard sem o login)*

---

## Sobre o projeto

O sistema centraliza o controle de acesso de visitantes externos (monitores, auditores e representantes de empresas farmacêuticas) à área de Pesquisa Clínica do hospital. Os dados são cadastrados via Google Forms e consumidos em tempo real pelo sistema, que permite filtrar visitantes por data e imprimir crachás diretamente em impressoras Zebra via ZPL.

O acesso é protegido por autenticação PHP + MySQL com senhas em hash bcrypt, e o servidor é restrito por IP via `.htaccess`.

---

## Funcionalidades

- Tela de login com autenticação segura (PHP + MySQL + bcrypt)
- Dashboard com listagem de visitantes filtrada por data
- Impressão de crachás ZPL em três tamanhos (5x3, 8x3, 9,5x4 cm)
- Controle de reimpressão via `localStorage`
- Persistência do tamanho de etiqueta preferido entre sessões
- Layout responsivo com identidade visual do Hospital de Amor

---

## Tecnologias utilizadas

| Camada | Tecnologia |
|--------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Backend | PHP 8+ |
| Banco de dados | MySQL (mysqli) |
| Autenticação | Sessões PHP + `password_hash()` bcrypt |
| Dados | Google Forms + Google Apps Script (Web App) |
| Impressão | Zebra BrowserPrint + ZPL |
| Controle de acesso | `.htaccess` por IP |

---

## Estrutura do projeto

```
visitas/
├── img/
│   ├── logo-ha-rgb.png
│   └── logo-ha-rgb-comp.png
├── css/
│   ├── style.css           # Estilos do dashboard
│   └── login.css           # Estilos da tela de login
├── js/
│   ├── app.js              # Lógica do frontend (busca dados, impressão ZPL)
│   └── BrowserPrint-3.1.250.min.js
├── .gitignore
├── .htaccess
├── config.php              # Credenciais do banco de dados (não versionar!)
├── dashboard.php           # Página principal (protegida por sessão PHP)
├── index.html              # Versão estática do dashboard para GitHub Pages
├── index.php               # Tela de login
├── logout.php              # Encerra a sessão e redireciona pro login
├── README.md
└── setup.sql               # Script SQL para criar tabela e usuário inicial
```

> **Nota sobre o `index.html`:** é o equivalente estático do `dashboard.php`, sem autenticação PHP, criado exclusivamente para visualização via GitHub Pages. Em produção, o acesso é feito pelo `index.php` (login) → `dashboard.php`.

---

## Fluxo de autenticação (produção)

```
Usuário acessa index.php
        ↓
Preenche usuário e senha
        ↓
PHP consulta tabela usuarios no MySQL
        ↓
password_verify() compara com o hash bcrypt
        ↓
✅ Correto → cria sessão → redireciona para dashboard.php
❌ Incorreto → exibe mensagem de erro
        ↓
Botão "Sair" → logout.php → destroi sessão → volta para index.php
```

---

## Como rodar localmente (XAMPP)

1. Inicie o **Apache** e o **MySQL** no XAMPP Control Panel
2. Copie a pasta do projeto para `C:\xampp\htdocs\controle-visitantes\`
3. Acesse `http://localhost/phpmyadmin` e crie o banco `visitas_db`
4. Execute o `setup.sql` na aba SQL do phpMyAdmin
5. Crie o arquivo `.env` na raiz do projeto com base no `.env.example`
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'visitas_db');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   ```
6. Acesse `http://localhost/visitas/`
   - Usuário: `visitantes` / Senha: `visitas123` *(altere após o primeiro acesso)*

---

## Segurança

- Senhas armazenadas com hash **bcrypt** via `password_hash()` do PHP
- Acesso ao dashboard bloqueado por **sessão PHP**
- Acesso ao servidor restrito por **IP via `.htaccess`**
- `config.php` listado no `.gitignore` — credenciais nunca sobem ao repositório
