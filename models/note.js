const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    Title: String,
    Description: String,
    Date: Date
});

module.exports = mongoose.model('notes', NoteSchema);