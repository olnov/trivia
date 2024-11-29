const express = require('express');
const router = express.Router();
const tokenChecker = require('../middleware/tokenChecker');
const { createUser, getUserById, updateUserById, deleteUserById } = require("../controllers/User");

router.post("/", createUser);
router.get("/:id", tokenChecker, getUserById);
router.patch("/:id", tokenChecker, updateUserById);
router.delete("/:id", tokenChecker, deleteUserById);

module.exports = router;