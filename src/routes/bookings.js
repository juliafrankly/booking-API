const express = require('express');
const { pool } = require('../db');

const router = express.Router();
const STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED'];

// Validerar body. Returnerar felmeddelande eller null.
function validate(b) {
    if (!b.name || typeof b.name !== 'string') return 'name krävs';
    if (!b.email || typeof b.email !== 'string' || !b.email.includes('@')) return 'giltig email krävs';
    if (!b.date_time || isNaN(Date.parse(b.date_time))) return 'giltig date_time krävs';
    if (!Number.isInteger(b.number_of_people) || b.number_of_people < 1) {
        return 'number_of_people måste vara ett heltal >= 1';
    }
    if (b.status !== undefined && !STATUSES.includes(b.status)) {
        return `status måste vara en av: ${STATUSES.join(', ')}`;
    }
    return null;
}

// Gör om :id till heltal, annars svara 400
router.param('id', (req, res, next, id) => {
    if (!/^\d+$/.test(id)) return res.status(400).json({ error: 'id måste vara ett heltal' });
    next();
});

router.get('/', async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM bookings ORDER BY id');
        res.status(200).json(rows);
    } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM bookings WHERE id = $1', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Bokningen finns inte' });
        res.status(200).json(rows[0]);
    } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
    try {
        const error = validate(req.body);
        if (error) return res.status(400).json({ error });
        const { name, email, date_time, number_of_people, status = 'PENDING' } = req.body;
        const { rows } = await pool.query(
            `INSERT INTO bookings (name, email, date_time, number_of_people, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, email, date_time, number_of_people, status]
        );
        res.status(201).json(rows[0]);
    } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
    try {
        const error = validate(req.body);
        if (error) return res.status(400).json({ error });
        const { name, email, date_time, number_of_people, status = 'PENDING' } = req.body;
        const { rows } = await pool.query(
            `UPDATE bookings
       SET name = $1, email = $2, date_time = $3, number_of_people = $4, status = $5
       WHERE id = $6 RETURNING *`,
            [name, email, date_time, number_of_people, status, req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Bokningen finns inte' });
        res.status(200).json(rows[0]);
    } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const { rowCount } = await pool.query('DELETE FROM bookings WHERE id = $1', [req.params.id]);
        if (rowCount === 0) return res.status(404).json({ error: 'Bokningen finns inte' });
        res.status(204).send();
    } catch (err) { next(err); }
});

module.exports = router;