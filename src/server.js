require('dotenv').config();
const express = require('express');
const { initDb } = require('./db');
const bookingsRouter = require('./routes/bookings');

const app = express();
app.use(express.json());

app.get('/instance', (req, res) => {
    res.status(200).json({ instance: process.env.INSTANCE_NAME || 'unknown' });
});

app.use('/bookings', bookingsRouter);

// Felhantering: ogiltig JSON → 400, övrigt → 500
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Ogiltig JSON' });
    }
    console.error(err);
    res.status(500).json({ error: 'Internt serverfel' });
});

const PORT = process.env.PORT || 3000;

initDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`${process.env.INSTANCE_NAME || 'unknown'} lyssnar på port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Kunde inte ansluta till databasen:', err.message);
        process.exit(1);
    });