const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const UserSchema = new Schema({
    UserName: {type:String, require:true, min:4, unique:true},
    PassWord:{type:String, require:true},
});

const UserModel = model('Users', UserSchema);

module.exports = UserModel;