const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

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
  try {
    const result = await pool.query(`
      UPDATE contador
      SET visitas = visitas + 1
      WHERE id = 1
      RETURNING visitas;
    `);
    res.json({ visitas: result.rows[0].visitas });
  } catch (error) {
    console.error('Erro ao atualizar o contador:', error);
    res.status(500).send('Erro ao atualizar o contador.');
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
