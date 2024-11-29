const express = require('express');
const { uploadProfileImage, getProfileImage } = require('../controllers/ProfileImages');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Upload profile image
router.patch('/:id/upload', upload.single('profileImage'), uploadProfileImage);
// Get profile image
router.get('/:id', getProfileImage);

module.exports = router;