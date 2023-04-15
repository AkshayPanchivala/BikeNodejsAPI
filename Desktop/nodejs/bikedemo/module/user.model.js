const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const validator = require('validator');
const AppError = require('../arrorhandler/Apperror');

const userschema=mongoose.Schema({
    name:{ 
        type:String,
        required:[true,'please provide name'],
        trim:[true,'Please Provide a name without a space'],
    },
    email:{
        type:String,
        required:[true,'please provide email'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'please provide password'],
        trim:[true,'Please Provide a password without a space'],
    },
    confirmpassword:{
        type:String,
        required:[true,'please provide confirmpassword'],
        validate:[{
            validator: function(el){
            return el===this.password;

        }}]
    }

});

userschema.pre('save',async function(next){
    
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if(this.email.match(emailRegex)){
        next();
        return this.email;
        
    }else{
        return next(new AppError('email is not valid',400));
    }
  
})
userschema.pre('save',async function(next){
    
    const hashedpassword= await bcrypt.hash(this.password,10);
    this.password=hashedpassword;
    this.confirmpassword=undefined;
    next();
})

const User=mongoose.model('Users',userschema);
module.exports=User;
