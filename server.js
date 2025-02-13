const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

let lands = [];

app.post('/api/register-land', (req, res) => {
    const { ownerName, ownerAddress, ownerContact, landAddress, landSize, landType } = req.body;
    const land = {
        id: lands.length + 1,
        ownerName,
        ownerAddress,
        ownerContact,
        landAddress,
        landSize,
        landType,
    };
    lands.push(land);
    res.json({ success: true, land });
});

app.get('/api/lands', (req, res) => {
    res.json(lands);
});

app.delete('/api/lands/:id', (req, res) => {
    const landId = parseInt(req.params.id, 10);
    lands = lands.filter(land => land.id !== landId);
    res.json({ success: true, message: 'Land deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
