const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const profileController = require('../controllers/profileController');

router.get('/', auth, profileController.getProfile);
router.put('/', auth, profileController.updateProfile);
router.post('/upload', auth, profileController.uploadProfilePicture);

module.exports = router;