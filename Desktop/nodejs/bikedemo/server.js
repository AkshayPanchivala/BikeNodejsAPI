require('dotenv').config();
const express=require('express');
const mongosanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const hpp=require('hpp');
const cors=require('cors');

const dbconnect=require('./connection/dbconnect');
const globalErrorHandler=require('./arrorhandler/globalerrorhandler');
const AppError=require('./arrorhandler/Apperror')

const app=express();


app.use(express.json());
app.use(mongosanitize());
app.use(xss());
app.use(hpp());
app.use(cors())

app.use('/user',require('./router/user.router'));
app.use('/user/biketype',require('./router/biketypes.router'));

app.use('/user/bike',require('./router/bike.router'));



app.all('*',(req,res,next)=>{
    next(new AppError(`can't find this page`,404));
    
    });
    app.use(globalErrorHandler);

dbconnect();

const PORT=3000;

app.listen(PORT,()=>{
    console.log(`app running on ${PORT} port`);
})

// Need to create Project for registering new bikes.where user should be able to register and logic and create bike types.and can create new bikes and with selected bike types
// and user can like and dislike bikes.can get bikes of the most liked bikes.and recently registered bikes and user can comment on bikes.

// APIS- register user
//       login user
//       create bike types
//       get all bike types
//       create bike
//       edit bike
//       delete bike
//       get all bikes
//       get bikes by bike types
//       get most recent regestered bikes 




//       get most liked bikes
//       comment on bike