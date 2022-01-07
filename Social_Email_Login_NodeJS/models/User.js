const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    social_id: {
        type: String,
      },
    social_provider: {
        type: String
      },
    social_photo_url: {
        type: String
      },
    name: {
        type : String,
        required : true
    },
    email: {
        type : String,
        required : true
    },
    password: {
        type : String,
        required : true
    },
    timestamp: {
        type : Date,
        default : new Date().getTime()
    }
})

const User = mongoose.model('User', UserSchema);
module.exports = User;