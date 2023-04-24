const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    Title: String,
    Date: Date,
    link: String
});

module.exports = mongoose.model('Assignment', AssignmentSchema);