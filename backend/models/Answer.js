const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  content: String,
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('answer', answerSchema);
