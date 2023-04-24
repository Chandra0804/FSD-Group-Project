const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: String,
    Email: String,
    Password: String,
    Security_Question: String,
    Security_Answer: String,
    Joined_Room: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
    Created_Room: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
    Position: { type: String, enum: ['student', 'mentor','admin'] },
    Tags: [String],
    Premium: Boolean
  });

module.exports = mongoose.model('users', UserSchema);