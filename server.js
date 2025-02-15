//bb1a0ede0cc05f633e5a6d7f5e2b8d728a0cc93eb7ab906f5be31cd634647fe8

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'bb1a0ede0cc05f633e5a6d7f5e2b8d728a0cc93eb7ab906f5be31cd634647fe8'; // Replace with your generated secret key

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
        res.json({ success: true, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
});

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.userId = decoded.userId;
            next();
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
    } else {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
};

// Register land
app.post('/api/register-land', authenticateJWT, async (req, res) => {
    const { ownerName, ownerAddress, ownerContact, landAddress, landSize, landPrice, landType } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO lands (ownerName, ownerAddress, ownerContact, landAddress, landSize, landPrice, landType, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [ownerName, ownerAddress, ownerContact, landAddress, landSize, landPrice, landType, req.userId]
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
