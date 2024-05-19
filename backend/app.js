// import { Express } from "express";
const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const Post = require('./models/post')
// While executing as a function, it returns the express app
// We can add middlewares using the app variable
const app = express();

// Middleware

// app.use((req,res,next)=>{
//   console.log('Hello Peter!!');
//   next(); // The request will pass through the upcoming midleware's only if it sees the next() function
// });
// rmSYumNXh13QwzfB -pass
// XLcfUSZnX4pwD8CM -password latest

const uri = "mongodb+srv://Geff29:Geoffrey2001@cluster0.gccedhs.mongodb.net/pixogram-db?retryWrites=true&w=majority&appName=Cluster0";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// mongoose.connect("mongodb+srv://Geff29:Geoffrey2001@cluster0.gccedhs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
// .then((resp)=>{
//   console.log(resp);
// })
// .catch((err)=>{
//   console.log(err);
//   console.error(err);
// })

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    console.log("Finally block");
    // await mongoose.disconnect();
  }
}
run()
.then(()=>{
  console.log("Connection established successfully");
})
.catch((err)=>{
  console.log("Connection failed due to " + err);
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req,res,next)=>{

  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE,OPTIONS,PUT');
  next();

});

app.post('/api/posts',(req,res,next)=>{
  // const post = req.body;
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  })
  console.log(post);
  post.save();
  res.status(201).json({
    message: 'Post added successfully'
  })
});

app.get('/api/posts',(req,res,next)=>{
  // const posts = [
  //   {
  //     id: '1',
  //     title: 'First post from ExpressJs',
  //     content: 'Sleepless'
  //   },
  //   {
  //     id: '2',
  //     title: 'Second post from ExpressJs',
  //     content: 'Nights'
  //   }
  // ];
  // res.send('ExpressJs Activated');
  // res.json();
  Post.find().then(documents=>
    res.status(200).json({
      message: "Posts fetched successfully",
      posts: documents
    })
  );
  // res.status(200).json({
  //   message: "Posts fetched successfully",
  //   posts: posts
  // })
});

module.exports = app;
