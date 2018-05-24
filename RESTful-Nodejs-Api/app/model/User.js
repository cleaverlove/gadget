
var mongoose = require('mongoose');
var Scheme = mongoose.Schema;
var UserScheme = new Scheme({
    name: String,
    password: String,
    admin: Boolean
})

module.exports = mongoose.model('User', UserScheme);