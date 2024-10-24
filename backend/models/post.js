const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  imagePath: {type: String, required: true},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: "User" ,required: true}
});


// creating a model schema for the post model and exporting it to be accessed outside of this file

module.exports = mongoose.model('Post',postSchema);
