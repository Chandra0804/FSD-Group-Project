const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    Title: String,
    Links: String,
    Date: String
});

module.exports = mongoose.model('resources', ResourceSchema);