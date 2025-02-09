const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

// Configurar CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Configurar a pool de conexões com o PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Middleware
app.use(express.json());

// Handler para a rota principal
const handler = async (req, res) => {
  const client = await pool.connect();
  
  try {
    // Criar tabela se não existir
    await client.query(`
      CREATE TABLE IF NOT EXISTS contador (
        id SERIAL PRIMARY KEY,
        visitas INTEGER DEFAULT 0
      );
    `);

    // Inserir registro inicial se não existir
    await client.query(`
      INSERT INTO contador (id, visitas)
      VALUES (1, 0)
      ON CONFLICT (id) DO NOTHING;
    `);

    // Atualizar contador
    const result = await client.query(`
      UPDATE contador
      SET visitas = visitas + 1
      WHERE id = 1
      RETURNING visitas;
    `);
    
    // Log para debug
    console.log('Visitas atualizadas:', result.rows[0]);
    
    res.json({ visitas: result.rows[0].visitas });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  } finally {
    client.release();
  }
};

// Rota principal
app.get('/api', handler);

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ status: 'API funcionando' });
});

// Handler de erro global
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
});

// Exporta o handler para uso com Vercel
module.exports = app;
