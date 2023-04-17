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
        ref: "Types",
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


///// set a date before save and create
bikeschema.pre('save',async function(next){
    this.createdAt=Date.now();
    next();
})


/*when run any type of find query then this function run
 and populate the biketypeid*/


bikeschema.pre(/^find/,function(next){
    this.populate({
        path:'BikeTypeID',
        select:'Biketype'

    });
    next();
})


const bike=mongoose.model('Bikes',bikeschema);
module.exports=bike;