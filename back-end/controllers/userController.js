require('dotenv').config();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = function (req, res) {
	User.findOne({ 'username': req.body.username, }).exec(function (err, user) {
		if (err) return res.status(500).send('Something went wrong');

		// No user 
		if (!user) return res.status(403).send('Incorrect username');

		// User exists, check for password
		bcrypt.compare(req.body.password, user.password, function (err, match) {
			if (!match) return res.status(403).send('Incorrect password');

			// Send user info
			jwt.sign({ user, }, process.env.SECRET_KEY, function (err, token) {
				res.json({ token, user, });
			});
		});
	});
};

const register = function (req, res) {
	// Check username existence
	User.findOne({ 'username': req.body.username, }).exec(function (err, user) {
		if (err) return res.status(500).send('Something went wrong');

		// Username existed
		if (user) return res.status(409).send('Username existed');
	});

	// Username not exist, register user
	bcrypt.hash(req.body.password, 10, function (err, hashedpassword) {
		if (err) return res.status(500).send('Something went wrong');

		// Create user
		let user = new User({
			username: req.body.username,
			password: hashedpassword,
		});

		user.save(function (err) {
			if (err) return res.status(500).send('Something went wrong!');

			// Send token, user info
			jwt.sign({ user, }, process.env.SECRET_KEY, function (err, token) {
				res.json({ token, user, });
			});
		});
	});
};

module.exports = {
	login,
	register,
};

