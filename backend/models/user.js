const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
});

userSchema.plugin(uniqueValidator);

// creating a model schema for the post model and exporting it to be accessed outside of this file

module.exports = mongoose.model('User',userSchema);
