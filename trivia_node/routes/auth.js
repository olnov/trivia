const express = require('express');
const Auth = require('../controllers/Auth');
const router = express.Router();

router.post('/',Auth.createToken);

module.exports = router;