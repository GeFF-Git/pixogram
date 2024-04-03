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
