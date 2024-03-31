// import { Express } from "express";
const express = require('express');

// While executing as a function, it returns the express app
// We can add middlewares using the app variable
const app = express();

// Middleware

app.use((req,res,next)=>{
  console.log('Hello Peter!!');
  next(); // The request will pass through the upcoming midleware's only if it sees the next() function
});

app.use((req,res,next)=>{
  res.send('ExpressJs Activated');
});

module.exports = app;
