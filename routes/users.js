const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const usersCtrl = require('../controllers/users');

router.get('/me', auth, usersCtrl.getMe);

module.exports = router;
