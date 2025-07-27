require('dotenv').config();
const express=require('express');
const mongosanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const cors=require('cors');
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
*/ 

app.use(express.json());
app.use(mongosanitize());
app.use(xss());
app.use(cors())


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
const PORT=8000;
app.listen(PORT,()=>{
    console.log(`app running on ${PORT} port`);
})

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