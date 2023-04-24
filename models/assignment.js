const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    Title: String,
    Date: String,
    link: String
});

module.exports = mongoose.model('assignments', AssignmentSchema);