const mongoose = require('mongoose');

const collabSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String },
  type: { type: String},
  photo: { type: String }, // stores filename
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Collab', collabSchema);
