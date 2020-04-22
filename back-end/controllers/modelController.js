require('dotenv').config();
const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('../models/user');
const Model = require('../models/model');
const fs = require('fs');

const getModels = function (req, res) {
	Model.find().exists('user', false).exec(function (err, models) {
		if (err) return res.status(500).send('Something went wrong');

		// No token provided, send public models
		if (!req.token) return res.json({ public: models, });

		// Token provided
		jwt.verify(req.token, process.env.SECRET_KEY, function (err, decoded) {
			if (err) return res.status(500).send('Something went wrong');

			User.findOne({ 'username': decoded.user.username, }, 'models').populate('models').exec(function (err, user) {
				if (err) return res.status(500).send('Something went wrong');

				// Invalid token, send public models
				if (!user) return res.json({ public: models, });

				// Valid token, send public and private models
				res.json({ public: models, private: user.models, });
			});
		});
	});
};

const getModel = function (req, res) {
	Model.findOne({ 'filename': req.params.filename, }).populate('user').exec(function (err, model) {
		if (err) return res.status(500).send('Something went wrong');

		// Model not found
		if (!model) return res.status(404).send('Model not found');

		// Model is public
		if (!model.user) {
			return res.sendFile(path.join(__dirname, '../upload', model.filename));
		}

		// Model is private, token is not provided
		if (!req.token) {
			return res.status(403).send('Model is private');
		}

		// Model is private, token is provided
		jwt.verify(req.token, process.env.SECRET_KEY, function (err, decoded) {
			if (err) {
				return res.status(500).send('Something went wrong');
			}

			if (decoded.user.username === model.user.username) {
				return res.sendFile(path.join(__dirname, '../upload', model.filename));
			}

			return res.status(403).send('Model is private');
		});

	});
};

const postModel = function (req, res) {
	if (!req.token) {
		fs.unlink(`upload/${req.file.filename}`, function (err) {
			if (err) return res.status(500).send('Something went wrong');
			res.status(403).send('Provide Token to upload');
		});
		return;
	}

	jwt.verify(req.token, process.env.SECRET_KEY, function (err, decoded) {
		if (err) {
			return res.status(500).send('Something went wrong');
		}

		User.findOne({ 'username': decoded.user.username, }).exec(function (err, user) {
			if (err) {
				return res.status(500).send('Something went wrong');
			}

			// Invalid token
			if (!user) {
				return res.status(403).send('Invalid token');
			}

			// Token ok, create model
			let model = new Model({
				user: user._id,
				filename: req.file.filename,
			});

			model.save(function (err) {
				if (err) console.log(err);
				if (err) return res.status(500).send('Something went wrong');
				user.models.push(model._id);
				user.save(function (err) {
					if (err) return res.status(500).send('Something went wrong');

					res.json(model);
				});
			});
		});
	});

};

const putModel = function (req, res) {
	if (!req.token) {
		fs.unlink(`upload/${req.file.filename}`, function (err) {
			if (err) return res.status(500).send('Something went wrong');
			res.status(403).send('Provide Token to Update');
		});
		return;
	}

	jwt.verify(req.token, process.env.SECRET_KEY, function (err, decoded) {
		if (err) {
			return res.status(500).send('Something went wrong');
		}

		Model.findOne({ 'filename': req.params.filename, }).populate('user').exec(function (err, model) {
			if (err) return res.status(500).send('Something went wrong');

			// Model not exist
			if (!model) return res.status(404).send('Model not exist');

			// User has no permission
			if (model.user.username !== decoded.user.username) return res.status(403).send('Invalid token');

			// Update
			fs.unlink(`upload/${model.filename}`, function (err) {
				if (err) return res.status(500).send('Something went wrong');
				fs.rename(`upload/${req.file.filename}`, `upload/${model.filename}`, function (err) {
					if (err) return res.status(500).send('Something went wrong');
					res.status(200).send('Model updated');
				});
			});

		});
	});

};

const deleteModel = function (req, res) {
	if (!req.token) return res.status(403).send('Provide Token to delete');

	jwt.verify(req.token, process.env.SECRET_KEY, function (err, decoded) {
		if (err) return res.status(500).send('Something went wrong');

		User.findById(decoded.user._id).populate('models').exec(function (err, user) {
			if (err) return res.status(500).send('Something went wrong');

			// Invalid Token
			if (!user) return res.status(403).send('Invalid token');

			// Token ok, delete model
			let index = user.models.findIndex(model => model.filename === req.params.filename);

			if (index === -1) return res.status(200).send('Model not exist');

			let model = user.models[index];
			user.models.splice(index, 1);

			// Update user.models
			user.save(function (err) {
				if (err) return res.status(500).send('Something went wrong');
				// Delete model from database and storage
				Model.findByIdAndDelete(model._id).exec(function (err) {
					if (err) return res.status(500).send('Something went wrong');
					fs.unlink(`upload/${model.filename}`, function (err) {
						if (err) return res.status(500).send('Something went wrong');


						res.status(200).send('Model deleted');
					});
				});
			});
		});
	});
};

module.exports = {
	getModels,
	getModel,
	putModel,
	postModel,
	deleteModel,
};

