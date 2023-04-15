const mongoose=require('mongoose');

const biketypeschema=mongoose.Schema({
    Biketype:{
        type:String,
        unique:true,
        required:[true,'please provide Biketype'],
    }
})

const biketypes=mongoose.model('Types',biketypeschema);
module.exports=biketypes;
