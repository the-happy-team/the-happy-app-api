const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const FeelingsSchema = new mongoose.Schema({
  feelings: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', MessageSchema);
const Feelings = mongoose.model('Feelings', FeelingsSchema);

module.exports = {
  Message,
  Feelings
};
