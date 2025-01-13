const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://visitas_owner:G4DPIcNOl0uH@ep-wispy-rain-a5gddatb.us-east-2.aws.neon.tech/visitas?sslmode=require',
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
const PORT = process.env.PORT || 3000;

// Serve arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Força a servir o index.html se a rota for "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para atualizar o contador
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
    res.status(500).send('Erro ao atualizar o contador');
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
