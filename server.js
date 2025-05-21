const express = require('express')
require('dotenv');
 require('./config/database')
 const morgan = require('morgan');
const cors = require('cors');
const bookRoutes = require('./routes/book');

const secret = process.env.EXPRESS_SECRET;
const PORT = 2001
 const app = express()
app.use(cors());
app.use(morgan('dev'));
const swaggerJSDOC = require('swagger-jsdoc');
const swaggerUIEXPRESS = require('swagger-ui-express');

app.use(express.json())

// Swagger Definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'RESTFUL API  Swagger Documentation for Book Collection',
    version: '1.0.0',
    description: 'This is a Swagger documentation for a Book Collection Restful API',
    license: {
      name: 
      'Base_URL: http://localhost:2001 ',
    },
    contact: {
      name: 'Strange',
      url: 'https://www.linkedin.com/in/urigwe-somto/',
    },
  },
  "components": {
 "securitySchemes": {
    "BearerAuth": {
      "type": 'http',
      "scheme": 'bearer',
      "bearerFormat": 'JWT',
    },
  },
},
security: [
  {
    bearerAuth: [],
  },
],
  servers: [
    {
    //   url: production,
    //   description: 'Production server',
    },
    {
      url: 'http://localhost:2001',
      description: 'Development server',
    },
  ],


};


// Swagger Options
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Adjust this path based on your actual route files
};

const swaggerSpec = swaggerJSDOC(options);

// Swagger UI setup
app.use('/docs', swaggerUIEXPRESS.serve, swaggerUIEXPRESS.setup(swaggerSpec));



app.use('/books', bookRoutes);

// Error handling (optional but useful for debugging)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT,()=>{
 console.log(`server listening to your ${PORT}`)  
})