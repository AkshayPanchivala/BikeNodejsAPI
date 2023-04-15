const mongoose=require('mongoose');

const likeschema=mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    Bike_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Bikes'
    }
});

const Like=new mongoose.model("Likes",likeschema);
module.exports=Like;