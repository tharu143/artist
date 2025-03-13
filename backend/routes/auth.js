const express = require('express');
const router = express.Router();
const { register, login, getArtists, registerArtist, getProfile } = require('../controllers/authController');
const { auth, isAdmin } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/artists', auth, isAdmin, getArtists);
router.post('/register/artist', auth, isAdmin, registerArtist);
router.get('/profile', auth, getProfile); // New profile endpoint

module.exports = router;