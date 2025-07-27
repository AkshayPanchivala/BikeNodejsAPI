require('dotenv').config();
const express=require('express');
const mongosanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const cors=require('cors');
const helmet = require('helmet');
const compression = require('compression');
const hpp = require('hpp');
// const {protect}=require('./controller/auth.controller');
const dbconnect=require('./connection/dbconnect');
const globalErrorHandler=require('./arrorhandler/globalerrorhandler');
const AppError=require('./arrorhandler/Apperror');

const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');

const app=express();

/*globally Middleware
express.json: Parses incoming JSON requests and makes the data available in req.body.
mongosanitize: Prevents MongoDB injection attacks by removing $ and . characters from incoming data.
xss: Protects against Cross-Site Scripting (XSS) attacks by sanitizing user input.
cors: Enables Cross-Origin Resource Sharing (CORS) to allow requests from different origins.
helmet: Secures Express apps by setting various HTTP headers.
compression: Compresses response bodies for performance.
hpp: Protects against HTTP Parameter Pollution attacks.
*/ 

app.use(express.json());
app.use(mongosanitize());
app.use(xss());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(hpp());


//routes
app.use('/user',require('./router/user.router'));
app.use('/user/biketype',require('./router/biketypes.router'));
app.use('/user/bike',require('./router/bike.router'));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


// error handling 
app.all('*',(req,res,next)=>{
    next(new AppError(`can't find this page`,404));
    });
    
app.use(globalErrorHandler);

//Data base connection
dbconnect();
const PORT=process.env.PORT || 8000;
const server = app.listen(PORT,()=>{
    console.log(`app running on ${PORT} port`);
})

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

/* Need to create Project for registering new bikes.where user should be able to 
register and logic and create bike types.and can create new bikes and with selected bike types
and user can like and dislike bikes.can get bikes of the most liked bikes.and recently registered 
bikes and user can comment on bikes.

APIS- register user
      login user
      create bike types
      get all bike types
      create bike
      edit bike
      delete bike
      get all bikes
      get bikes by bike types
      get most recent regestered bikes 
      get most liked bikes
      comment on bike
*/