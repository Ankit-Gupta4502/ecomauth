const mongoose = require('mongoose');
const EcomUsers = new mongoose.Schema({
    name: {
        required: true,
        maxLength: 100,
        type: String,
    },
    email: {
        type: String,
        default: '',
        required: true,
    },
    password: {
        type: String,
        required: true,
    },

})


module.exports = mongoose.model('EcomUsers', EcomUsers);