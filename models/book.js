const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    title: {
        type: String, 
        required: true, 
        unique: true
    },
    author:  {
        type: String,
        default: "Unknown"
    },
    category: {
        type: String, 
        required: true},
    shelf:  {
        type: Number
    },
    numAvailable:  {
        type: Number
    }
    
});

module.exports = mongoose.model('Book', BookSchema);