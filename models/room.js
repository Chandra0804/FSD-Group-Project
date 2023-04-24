const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  title: String,
  description: String,
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: [{
      title: String,
      description: String,
      date: { type: Date, default: Date.now }
    }]
  }],
  tags: [String]
});

module.exports = mongoose.model('Study-rooms',roomSchema);