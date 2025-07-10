const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: String,
  content: String,
  important: {
    type: Boolean,
    default: false
  },
  reactions: {
    type: Map,
    of: Number,
    default: {}
  }
});

module.exports = mongoose.model('Message', messageSchema);
