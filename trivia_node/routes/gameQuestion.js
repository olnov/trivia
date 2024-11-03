const express = require('express');
const router = express.Router();
const tokenChecker = require('../middleware/tokenChecker');
const { createScoreRecords, getScoreBoard, createScoreRecord } = require('../controllers/GameQuestion');

router.post("/new", tokenChecker, createScoreRecords);
router.post("/new_test", createScoreRecord);
router.get("/", tokenChecker, getScoreBoard);

module.exports = router;