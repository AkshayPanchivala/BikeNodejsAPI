const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const validator = require('validator');

const userschema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'please provide name']
    },
    email:{
        type:String,
        required:[true,'please provide email'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'please provide password']
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
    
    const hashedpassword= bcrypt.hash(this.password,10);
    this.password=hashedpassword;
    this.confirmpassword=undefined;
    next();
})
const User=mongoose.model('Users',userschema);
module.exports=User;
