const mongoose=require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const bikeschema=mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:[true,'please provide name'],
        trim:[true,'Please provide a name without a space'],

    },
    BikeTypeID: {
        type: mongoose.Schema.ObjectId,
        ref: "Types",
        required:true
      },
      
    createdAt:{
        type:Date,
      },
    price:{
        type:Number,
        required:[true,'Please provide price'],
    }
}, { 

    toJSON: { virtuals: true },
    toObject: { virtuals: true } 
})

///// set a date before save and create
bikeschema.pre('save',async function(next){
    this.createdAt=Date.now();
    next();
})

bikeschema.plugin(mongoosePaginate);


/*when run any type of find query then this function run
 and populate the biketypeid*/


bikeschema.pre(/^find/,function(next){
    this.populate({
        path:'BikeTypeID',
        select:'Biketype'

    });
    next();
})


bikeschema.virtual("likes", {
    ref: "Likes",
    localField: "_id",
    foreignField: "Bike_id",   
  });
  bikeschema.virtual("likescount", {
    ref: "Likes",
    localField: "_id",
    foreignField: "Bike_id",
    count:true,
   
  });
  
  bikeschema.virtual("dislikes", {
    ref: "DisLikes",
    localField: "_id",
    foreignField: "Bike_id",
   
  });
  bikeschema.virtual("dislikescount", {
    ref: "DisLikes",
    localField: "_id",
    foreignField: "Bike_id",
    count:true,
  });
  
  bikeschema.virtual("comments", {
    ref: "Comments",
    localField: "_id",
    foreignField: "Bike_id",
  
  });
  bikeschema.virtual("commentscount", {
    ref: "Comments",
    localField: "_id",
    foreignField: "Bike_id",
    count:true,
  });

const bike=mongoose.model('Bikes',bikeschema);
module.exports=bike;