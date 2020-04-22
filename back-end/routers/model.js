const express = require('express');
const { verifyToken, } = require('../middlewares/verifyToken');
const { v4: uuidv4, } = require('uuid');
const multer = require('multer');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'upload/')
	},
	filename: function (req, file, cb) {
		cb(null, `${uuidv4()}.glb`)
	}
});
const upload = multer({ storage: storage, });
const router = express.Router();

const modelController = require('../controllers/modelController');

// Get all models
router.get('/', verifyToken, modelController.getModels);

// Create model
router.post('/', verifyToken, upload.single('model'), modelController.postModel);

// Update model
router.put('/:filename', verifyToken, upload.single('model'), modelController.putModel);

// Delete model
router.delete('/:filename', verifyToken, modelController.deleteModel);

// Get model
router.get('/:filename', verifyToken, modelController.getModel);

module.exports = router;

