const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    Title: String,
    Links: [String],
    Date: Date
});

module.exports = mongoose.model('Resource', ResourceSchema);