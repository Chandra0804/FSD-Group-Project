const mongoose = require('mongoose');
const Assignment = require('./assignment');
const Resource = require('./resource');
const User = require('./user');

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
  syllabus: String,
  tags: [String],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }], // Add the assignments field
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }], // Add the resources field
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('rooms-studies',roomSchema);