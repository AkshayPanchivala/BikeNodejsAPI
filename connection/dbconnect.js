const mongoose=require('mongoose');
const AppError = require('../arrorhandler/Apperror');


const connection=async(req,res,next)=>{
    try{
        const connection=await mongoose.connect(`${process.env.database_url}`);
       console.log("Successfully connect your appplictaion with database!!")
    }catch(err){
        return next(new AppError("Database connection are refused", 404));
    }
}
module.exports=connection;