const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const port = 3000;

// Configuração do MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123qwerty",
    database: "my_database"
});

db.connect(err => {
    if (err) {
        console.error("Erro ao conectar ao MySQL:", err);
        return;
    }
    console.log("Conectado ao MySQL!");
});

app.use(cors());
app.use(express.json()); // Middleware para interpretar JSON corretamente

// Rota para obter os itens
app.get("/items", (req, res) => {
    db.query("SELECT * FROM items", (err, result) => {
        if (err) {
            console.error("Erro ao buscar itens:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

// Rota para adicionar um item
app.post("/items", (req, res) => {
    console.log("Recebendo requisição POST para adicionar item:", req.body);

    const { name } = req.body;

    if (!name || name.trim() === "") {
        console.error("Erro: Nome inválido recebido:", name);
        return res.status(400).json({ error: "Nome é obrigatório" });
    }

    db.query("INSERT INTO items (name) VALUES (?)", [name], (err, result) => {
        if (err) {
            console.error("Erro ao adicionar item:", err);
            return res.status(500).json({ error: err.message });
        }
        console.log("Item adicionado com sucesso:", { id: result.insertId, name });
        res.json({ id: result.insertId, name });
    });
});

// Rota para remover um item
app.delete("/items/:id", (req, res) => {
    const { id } = req.params;
    console.log("Recebendo requisição DELETE para ID:", id);

    db.query("DELETE FROM items WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error("Erro ao remover item:", err);
            return res.status(500).json({ error: err.message });
        }
        console.log("Item removido com sucesso, ID:", id);
        res.json({ message: "Item removido com sucesso!" });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
