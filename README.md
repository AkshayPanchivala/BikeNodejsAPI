# Bike Hub API

This project is a demonstration of a Bike API built using Node.js. It allows users to register and login using JWT authentication. Once logged in, users can perform various operations related to bikes, such as adding different types of bikes, updating, deleting, liking, disliking, and commenting on bikes. The API also supports pagination when retrieving the list of all bikes.

## Features

- **User Registration**: Users can register with their details to create a new account.
- **User Login**: Registered users can login using their credentials to obtain a JWT token for authenticated requests.
- **Add Bike Types**: Users can add different types of bikes (e.g., EV, Petrol, Diesel).
- **Manage Bikes**: Users can add, update, and delete bike entries.
- **Like/Dislike Bikes**: Users can like or dislike specific bikes.
- **Comment on Bikes**: Users can add comments on different bikes.
- **Get All Bikes**: Retrieve a list of all bikes with support for pagination.

## Technology Stack

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for building the API.
- **MongoDB**: Database to store user and bike information.
- **JWT**: JSON Web Token for user authentication.

## Getting Started

### Prerequisites

- Node.js and npm should be installed.
- MongoDB should be running on your local machine or a cloud instance.

### Installation

1. Clone the repository:

    ```bash
    git clone git@github.com:AkshayPanchivala/BikeNodejsAPI.git
    cd BikeNodejsAPI
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the root directory and add the following:

    ```plaintext
    jwt_secretkey=bikedemo
    jwt_expirydate=1d
    database_url=your_database_url
    ```

4. Start the server:

    ```bash
    npm start
    ```

5. The API will be running at `http://localhost:8000`.

### API Documentation (Swagger UI)

Once the server is running, you can access the interactive API documentation (Swagger UI) at:

`http://localhost:8000/api-docs`

This interface allows you to explore all available endpoints, their parameters, and expected responses.

## API Endpoints

### Auth Routes

- **POST /user/register**: Register a new user.
    - Request body: `{"name":"Temp User","email":"temp@gmail.com","password":"Temp@1112","confirmPassword":"Temp@1112"}`
  
- **POST /user/login**: Login with existing user credentials.
    - Request body: ` {"email":"temp@gmail.com","password":"Temp@1112"}`

### Bike Type Routes

- **POST /user/biketype**: Add a new bike type (e.g., EV, petrol, diesel).
    - Request body: `{ "bikeType": "EV" }`
- **GET /user/biketype**: Get all bikes types.
    
  
### Bike Routes

- **POST /user/bike**: Add a new bike.
    - Request body: `{  "bikeTypeId":"66cc2554a09aea5cd561306e","name":"Acstwivaddddwswz sd5g","price":50000 }`
  
- **PUT /user/bike/:id**: Update an existing bike.
    - Request body: `{ "name": "Updated Bike Name" }`
  
- **DELETE /user/bike/:id**: Delete a bike.

- **GET /user/bike**: Get all bikes (Without pagination).
   
- **GET /user/bike/paginated**: Get all bikes with pagination (support pagination).
    - Query parameters: `?page=1&limit=10`
- **GET /user/bike/recent**: Get all recent added bikes (support pagination).
    - Query parameters: `?page=1&limit=10`

### Interaction Routes

- **POST /user/bike/:id/like**: Like a bike.
  
- **POST /user/bike/:id/dislike**: Dislike a bike.
  
- **POST /user/bike/:id/comment**: Comment on a bike.
    - Request body: `{ "comment": "Great bike!" }`


