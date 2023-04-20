const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users", 
  },
  Bike_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bikes",
    required:true
  },
  comment: {
    type: String,
    trim:[true,'Please Provide a comment without a space'],
  },
});
commentSchema.pre('find',function(next){
  this.populate({
      path:'Bike_id',
  });
  next();
})
const Comments = new mongoose.model("Comments", commentSchema);
module.exports=Comments;
