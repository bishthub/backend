const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: String,
  blockchainNumber: { type: Number },
  optionId: mongoose.Types.ObjectId,
  count: { type: Number, default: 0 },
});

const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [optionSchema],
  questionNumber: Number,
  totalAnswered: { type: Number, default: 0 },
  chainName: String,
  answeredByUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Assuming you have a User model
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
