const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

// Configuração básica do CORS
app.use(cors());

// Configuração do PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Rota principal da API
app.get('/api', async (req, res) => {
    let client;
    
    try {
        client = await pool.connect();
        
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

        res.json({ visitas: result.rows[0].visitas });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Rota de teste
app.get('/api/test', (req, res) => {
    res.json({ status: 'OK' });
});

module.exports = app;
