const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const schema = mongoose.Schema


const userSchema = new schema({

    firstName:{
        type:String,
        required: true,
    },
    lastName:{

        type:String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: 'default.jpg'
      },
    active:{
        type: Boolean,
         default: true
    }
}, {timestamps: true})

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };


  userSchema.methods.passwordResetToken = async function(){
      
    //generate Refresh Token
    const refreshToken =  crypto.randomBytes(32).toString('hex')

    //resetToken add to Db
    this. resetPasswordToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    this. exprireToken =  Date.now() + 10 * 60 * 1000 //milliseconds
    return refreshToken;
  }

const users = mongoose.model('users', userSchema);
module.exports = users;
      