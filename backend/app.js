// import { Express } from "express";
const express = require('express');

// While executing as a function, it returns the express app
// We can add middlewares using the app variable
const app = express();

// Middleware

// app.use((req,res,next)=>{
//   console.log('Hello Peter!!');
//   next(); // The request will pass through the upcoming midleware's only if it sees the next() function
// });

app.use((req,res,next)=>{

  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Header','Origin,X-Requested-With,Content-Type,Accept');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE,OPTIONS,PUT');
  next();

});

app.use('/api/posts',(req,res,next)=>{
  const posts = [
    {
      id: '1',
      title: 'First post from ExpressJs',
      content: 'Sleepless'
    },
    {
      id: '2',
      title: 'Second post from ExpressJs',
      content: 'Nights'
    }
  ];
  // res.send('ExpressJs Activated');
  // res.json();
  res.status(200).json({
    message: "Posts fetched successfully",
    posts: posts
  })
});

module.exports = app;
