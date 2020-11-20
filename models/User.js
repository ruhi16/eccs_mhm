const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstname:{type: String},
    lastname:{type: String},
    email:{type: String},
    password:{type: String},
    address:{type: String},
    user_type:{type: String},   //user, shop, club, etc
    email_otp:{type: String},
    email_validation_link:{type: String},
    is_otp_validated:{type: Boolean},
    access_token:{type:String},
    refresh_token:{type:String},
    date: { type: Date, default: Date.now },
});



userSchema.methods.isValidPassword = async function(password){
    try{
        return await bcrypt.compare(password, this.password);

    }catch(error){
        throw error
    }
}

module.exports = User = mongoose.model('user', userSchema);