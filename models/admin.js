require('../config');
const admin = require('../schema/admin_schema');
const contact = require('../schema/contactn_schema');
const ObjectId = require('mongoose').Types.ObjectId;



const check_admin = async (username, password) => {
    // user name has both email and username
    let user = await admin.findOne({ $or: [{ username: username }, { email: username }] });
    if (user) {
        if (user.password === password) {
            return user;
        } else {
            return false;
        }
    }
    return false;
    
}

const save_contact = async (name, message) => {
    return await contact.create({ name, message });
}

//get all contacts
const get_contacts = async () => {
    return await contact.find({});
}
//delete_contact
const delete_contact = async (id) => {
    return await contact.deleteOne({ _id: ObjectId(id) });
}

module.exports = {
    check_admin,
    save_contact,get_contacts,delete_contact
}