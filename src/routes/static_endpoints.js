const express = require('express');
const router = express.Router();
const db = require('../utils/database');
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = router;