const express = require('express');
const router = express.Router();
const { register, login, loginWithGoogle } = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/google-native', loginWithGoogle);

router.get('/health', (req, res) => {
    res.status(200).send('OK');
});

module.exports = router;