const mongoose=require('mongoose');

const dislikeschema=mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    Bike_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Bikes'
    }
});

const DisLike=new mongoose.model("DisLikes",dislikeschema);
module.exports=DisLike;