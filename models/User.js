const monguse = require('mongoose');

const userSchema = new monguse.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = monguse.model('User', userSchema);