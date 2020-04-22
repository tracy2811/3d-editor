const express = require('express');
const { validateUserInput, } = require('../middlewares/validateInput');
const multer = require('multer');
const upload = multer();
const router = express.Router();

const userController = require('../controllers/userController');

// Login
router.post('/login', upload.none(), validateUserInput, userController.login);

// Register
router.post('/register', upload.none(), validateUserInput, userController.register);

module.exports = router;

