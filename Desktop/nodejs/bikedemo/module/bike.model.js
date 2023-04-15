const mongoose=require('mongoose');

const bikeschema=mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:[true,'please provide name'],
        trim:[true,'Please Provide a name without a space'],

    },
    BikeTypeID: {
        type: mongoose.Schema.ObjectId,
        ref: "Type",
        required:true
      },
      createdAt:{
        type:Date,
      },
    price:{
        type:Number,
        required:[true,'please provide price'],
    }
})
bikeschema.pre('save',async function(next){
    this.createdAt=Date.now();
    next();
})
const bike=mongoose.model('Bikes',bikeschema);
module.exports=bike;