const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

// Configurar a pool de conexões com o PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Handler para a rota principal
const handler = async (req, res) => {
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

    const result = await client.query(`
      UPDATE contador
      SET visitas = visitas + 1
      WHERE id = 1
      RETURNING visitas;
    `);
    
    client.release();
    res.json({ visitas: result.rows[0].visitas });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

app.get('/api', handler);

// Exporta o handler para uso com Vercel
module.exports = app;
