const mongoose=require('mongoose');
const AppError = require('../arrorhandler/Apperror');

const connection=async(req,res,next)=>{
    try{
        const connection=await mongoose.connect(`mongodb+srv://aks:${process.env.database_password}@you.xowgdbn.mongodb.net/${process.env.database_name}?retryWrites=true&w=majority`);
        console.log('Database connection done');
    }catch(err){
        console.log(err);
       
      
    }
}
module.exports=connection;