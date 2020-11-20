const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const clubSchema = new mongoose.Schema({
    name:{type: String},
    vill:{type: String},
    post:{type: String},
    ps:{type: String},
    dist:{type: String},
    pin:{type: String},
    imageUrl:{type: String}
    
});





module.exports = Club = mongoose.model('club', clubSchema);


