const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
<<<<<<< HEAD
=======
const PORT = process.env.PORT || 3000;
>>>>>>> 4a921388ee76924d68ab4f655dd2284631261a94

// Configurar a pool de conexões com o Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página inicial
app.get('/', async (req, res) => {
<<<<<<< HEAD
=======
  try {
    // Atualiza o contador no banco de dados
    await pool.query(`
      UPDATE contador
      SET visitas = visitas + 1
      WHERE id = 1;
    `);

    // Envia o arquivo index.html
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } catch (error) {
    console.error('Erro ao atualizar o contador:', error);
    res.status(500).send('Erro ao carregar a página.');
  }
});

// Rota para atualizar o contador separadamente (caso precise)
app.get('/api/contador', async (req, res) => {
>>>>>>> 4a921388ee76924d68ab4f655dd2284631261a94
  try {
    // Atualiza o contador no banco de dados
    await pool.query(`
      UPDATE contador
      SET visitas = visitas + 1
      WHERE id = 1;
    `);

    // Envia o arquivo index.html
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } catch (error) {
    console.error('Erro ao atualizar o contador:', error);
<<<<<<< HEAD
    res.status(500).send('Erro ao carregar a página.');
  }
});

// Exporta o app para ser usado no Vercel
module.exports = app;
=======
    res.status(500).send('Erro ao atualizar o contador.');
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
>>>>>>> 4a921388ee76924d68ab4f655dd2284631261a94
