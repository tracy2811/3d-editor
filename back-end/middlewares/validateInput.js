const validateUserInput = function (req, res, next) {
	let errors = {};
	if (!req.body.username || !req.body.username.trim()) {
		errors.username = 'Username required';
	}

	if (!req.password) {
		errors.password = 'Password required';
	}

	if (Object.entries(errors).length) {
		req.errors = errors;
	}

	next();
};

module.exports = {
	validateUserInput,
};

