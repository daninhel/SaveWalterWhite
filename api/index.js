const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

// Configurar CORS para aceitar requisições do domínio do Vercel
app.use(cors({
  origin: ['https://save-walter-white-five.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true
}));

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Configurar a pool de conexões com o PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(express.json());

// Handler para a rota principal
const handler = async (req, res) => {
  console.log('Iniciando handler da API');
  let client;
  
  try {
    client = await pool.connect();
    console.log('Conectado ao banco de dados');

    // Criar tabela se não existir
    await client.query(`
      CREATE TABLE IF NOT EXISTS contador (
        id SERIAL PRIMARY KEY,
        visitas INTEGER DEFAULT 0
      );
    `);
    console.log('Tabela verificada/criada');

    // Inserir registro inicial se não existir
    await client.query(`
      INSERT INTO contador (id, visitas)
      VALUES (1, 0)
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('Registro inicial verificado');

    // Atualizar contador
    const result = await client.query(`
      UPDATE contador
      SET visitas = visitas + 1
      WHERE id = 1
      RETURNING visitas;
    `);
    
    console.log('Contador atualizado:', result.rows[0]);
    
    // Configurar headers de cache
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });

    res.json({ visitas: result.rows[0].visitas });
  } catch (error) {
    console.error('Erro no handler:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    if (client) {
      console.log('Liberando conexão com o banco');
      client.release();
    }
  }
};

// Rota principal
app.get('/api', handler);

// Rota de teste/health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ status: 'API funcionando' });
});

// Handler de erro global
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor', 
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Exporta o handler para uso com Vercel
module.exports = app;
