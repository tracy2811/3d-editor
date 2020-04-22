const express = require('express');
const router = express.Router();

// Get API information
router.get('/', function (req, res, next) {
	res.json({
		'users': {
			'login': {
				'desciption': 'Get token with username and password',
				'method': 'POST',
				'body': {
					'username': 'string',
					'password': 'string',
				},
				'url': 'http://localhost:8000/users/login',
				'success': 'Return token and user',
			},

			'register': {
				'desciption': 'Register and get token with username and password',
				'method': 'POST',
				'body': {
					'username': 'string',
					'password': 'string',
				},
				'url': 'http://localhost:8000/users/register',
				'success': 'Return token and user',
			},
		},

		'models': {
			'getModels': {
				'desciption': 'Get list of models available',
				'method': 'GET',
				'url': 'http://localhost:8000/models',
				'success': 'Return models as { public, private }',
				'note': 'Token in header is required to get private models',
			},

			'getModel': {
				'desciption': 'Get specific model',
				'method': 'GET',
				'url': 'http://localhost:8000/models/${filename}',
				'success': 'Return model file',
				'note': 'Token in header is required to get private models',

			},

			'postModel': {
				'desciption': 'Create and save new model in server',
				'method': 'POST',
				'body': {
					'model': '.glb file',
				},
				'url': 'http://localhost:8000/models',
				'success': 'Return 200',
				'note': 'Token in header is required',

			},

			'putModel': {
				'desciption': 'Update a model in server',
				'method': 'PUT',
				'body': {
					'model': '.glb file',
				},
				'url': 'http://localhost:8000/models/${filename}',
				'success': 'Return 200',
				'note': 'Token in header is required',

			},

			'deleteModel': {
				'desciption': 'Delete a model in server',
				'method': 'POST',
				'url': 'http://localhost:8000/models/${filename}',
				'success': 'Return 200',
				'note': 'Token in header is required',

			},
		},

	});
});

module.exports = router;

