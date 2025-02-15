const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const JWT_SECRET = '7856fc2796243fc87359b1ab2b7df1476192f11f980e23e8b83b0714e7b898a8'; // Replace with your generated secret key

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// User registration
app.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
            [username, hashedPassword, email]
        );
        res.json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ success: false, message: 'Username already exists' });
        } else {
            console.error('Registration error:', error);
            res.status(500).json({ success: false, message: 'User registration failed' });
        }
    }
});

// User login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        const id = user.id;
        res.json({ success: true, token, userid: id });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
});

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ success: false, message: "No token provided" });

    const token = authHeader.split(' ')[1]; // Extract token
    console.log(token);
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err){
            console.log(err);
            return res.status(403).json({ success: false, message: "Invalid token" })};
        req.userId = user.userId; // Ensure userId is passed
        next();
    });
};



// Register land
app.post('/api/register-land', authenticateJWT, async (req, res) => {
    const { ownerName, ownerAddress, ownerContact, landAddress, landSize, landPrice, landType, userId } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO lands (ownerName, ownerAddress, ownerContact, landAddress, landSize, landPrice, landType, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [ownerName, ownerAddress, ownerContact, landAddress, landSize, landPrice, landType, userId]
        );
        res.json({ success: true, landId: result.insertId });
    } catch (error) {
        console.error('Land registration error:', error);
        res.status(500).json({ success: false, message: 'Land registration failed' });
    }
});

// Get lands
app.get('/api/lands', authenticateJWT, async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM lands WHERE userId = ?', [req.userId]);
        res.json(rows);
    } catch (error) {
        console.error('Fetch lands error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch lands' });
    }
});

// Delete land
app.delete('/api/lands/:id', authenticateJWT, async (req, res) => {
    const landId = req.params.id;
    try {
        const [result] = await db.execute('SELECT * FROM lands WHERE id = ? AND userId = ?', [landId, req.userId]);
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'Land not found' });
        }
        await db.execute('DELETE FROM lands WHERE id = ? AND userId = ?', [landId, req.userId]);
        res.json({ success: true, message: 'Land deleted successfully' });
    } catch (error) {
        console.error('Land deletion error:', error);
        res.status(500).json({ success: false, message: 'Land deletion failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
