const mongoose=require('mongoose');

const connection=async()=>{
    await mongoose.connect(`${process.env.database_url}`);
    console.log("Successfully connect your appplictaion with database!!")
}

mongoose.connection.on('error', err => {
  console.error(`Database connection error: ${err}`);
});

module.exports=connection;