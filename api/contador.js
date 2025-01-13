const { Pool } = require('pg');

// Configurar a pool de conexões com o Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://visitas_owner:G4DPIcNOl0uH@ep-wispy-rain-a5gddatb.us-east-2.aws.neon.tech/visitas?sslmode=require',
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = async (req, res) => {
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
};

