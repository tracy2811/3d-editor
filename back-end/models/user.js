const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		username: { type: String, required: true, },
		password: { type: String, required: true, },
		models: [{ type: Schema.Types.ObjectId, ref: 'Model', }],
	}
);

UserSchema.virtual('name').get(function () {
	return this.username;
});

module.exports = mongoose.model('User', UserSchema);

