const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const validator = require('validator');
const AppError = require('../arrorhandler/Apperror');

const userschema=mongoose.Schema({
    name:{ 
        type:String,
        trim:[true,'Please Provide a name without a space'],
    },
    email:{
        type:String,
        unique:true,
        validate:[validator.isEmail,'Please provide Email']
    },
    password:{
        type:String,
        trim:[true,'Please Provide a password without a space'],
        validate:[validator.isStrongPassword,'Please provide strong password']
        
    },
    confirmpassword:{
        type:String,
        validate:[{
            validator: function(el){
            return el===this.password;

        }}]
    }

 });

//password validation
userschema.pre('save',async function(next){
  
    if(this.password.includes(' ')||(this.password.length<8)){
        
        return next(new AppError('password has not valid',400));
    }
    next();
})
/// password hashing and confirmpassword undefined
userschema.pre('save',async function(next){
    
    const hashedpassword= await bcrypt.hash(this.password,10);
    this.password=hashedpassword;
    this.confirmpassword=undefined;
    next();
})




const User=mongoose.model('Users',userschema);
module.exports=User;
