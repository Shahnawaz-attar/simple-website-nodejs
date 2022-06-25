const mangoose = require('mongoose');

const Admin_schema = new mangoose.Schema({
    username: String,
    password: String
});

module.exports = mangoose.model('admins', Admin_schema);