require('dotenv').config();
const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

// Configurar a pool de conexões com o PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Inicializar banco de dados
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS contador (
        id SERIAL PRIMARY KEY,
        visitas INTEGER DEFAULT 0
      );
      INSERT INTO contador (id, visitas)
      VALUES (1, 0)
      ON CONFLICT (id) DO NOTHING;
    `);
    client.release();
    console.log('Banco de dados inicializado com sucesso');
  } catch (err) {
    console.error('Erro ao inicializar banco:', err);
  }
}

// Inicializa o banco se estivermos em ambiente de produção
if (process.env.NODE_ENV === 'production') {
  initializeDatabase();
}

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para obter contagem atual
app.get('/api/contador', async (req, res) => {
  try {
    const client = await pool.connect();
    // Atualiza o contador no banco de dados
    const result = await client.query(`
      UPDATE contador
      SET visitas = visitas + 1
      WHERE id = 1
      RETURNING visitas;
    `);
    client.release();
    
    res.json({ visitas: result.rows[0].visitas });
  } catch (error) {
    console.error('Erro ao atualizar contador:', error);
    res.status(500).json({ error: 'Erro ao atualizar contador' });
  }
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

// Exporta o app para ser usado no Vercel
module.exports = app;
