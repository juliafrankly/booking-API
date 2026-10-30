const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Skapar tabellen om den inte redan finns (säkert att köra i flera instanser)
async function initDb() {
    const sql = fs.readFileSync(path.join(__dirname, '..', 'db', 'init.sql'), 'utf8');
    await pool.query(sql);
}

module.exports = { pool, initDb };