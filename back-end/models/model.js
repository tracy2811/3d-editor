const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelSchema = new Schema(
	{
		filename: { type: String, required: true, },
		user: { type: Schema.Types.ObjectId, ref: 'User', },
	}
);

module.exports = mongoose.model('Model', ModelSchema);

