const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/register-land', async (req, res) => {
    const { ownerName, ownerAddress, ownerContact, landAddress, landSize, landPrice, landType } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO lands (ownerName, ownerAddress, ownerContact, landAddress, landSize, landPrice, landType) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [ownerName, ownerAddress, ownerContact, landAddress, landSize, landPrice, landType]
        );
        res.json({ success: true, landId: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Land registration failed' });
    }
});

app.get('/api/lands', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM lands');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch lands' });
    }
});

app.delete('/api/lands/:id', async (req, res) => {
    const landId = req.params.id;
    try {
        await db.execute('DELETE FROM lands WHERE id = ?', [landId]);
        res.json({ success: true, message: 'Land deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Land deletion failed' });
    }
});

app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
