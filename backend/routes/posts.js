const express = require("express");
const Post = require('../models/post');
const multer = require('multer');
const router = express.Router();
const checkAuth = require("./../middleware/check-auth");

const MIME_TYPE = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg"
}

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        const isValid = MIME_TYPE[file.mimetype];
        let message = new Error("Invalid MIME type");
        if (isValid) {
            message = null;
        }
        cb(message,"backend/images"); // Path is relative to server.js file therefore we have the path as "backend/images"
    },
    filename: (req,file,cb)=>{
        const fileName = file.originalname.toLowerCase().replace(' ','-');
        const extension = MIME_TYPE[file.mimetype];
        cb(null,fileName + '-' + Date.now() + '.' + extension);
    }    
});

// multer(storage).single("image") means that multer expects a single file with image property
router.post('', checkAuth , multer({storage: storage}).single("image"), (req, res, next) => {
    // const post = req.body;
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
        title : req.body.title,
        content : req.body.content,
        imagePath : url + "/images/" + req.file.filename,
        creator : req.userData.userId
    })
    console.log(post);
    post.save().then(resp => {
        console.log(resp);
        res.status(201).json({
            message: 'Post added successfully',
            postData:{
                ...resp,
                id: resp._id
            }
        })
    });
});

// router.get('', (req, res, next) => {

//     const pageSize = +req.query.pagesize; // Adding (+) here to convert the string to a number. By default, params received from the url is a string
//     const currentPage = +req.query.page;
//     const postQuery = Post.find();
//     console.log(pageSize);
//     console.log(currentPage);
//     if (pageSize && currentPage) {
//         postQuery.
//         skip(pageSize * (currentPage-1)).
//         limit(pageSize)
//     }

//     postQuery.then(documents => {
//         fetchedPosts = documents;
//         return documents.count();
//     })
//     .then(count => {
//         res.status(200).json({
//             message: "Posts fetched successfully",
//             posts: fetchedPosts,
//             maxPosts: count
//         })
//     })

// });
router.get("", (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
      postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    postQuery
      .then(documents => {
        fetchedPosts = documents;
        return Post.countDocuments();
      })
      .then(count => {
        res.status(200).json({
          message: "Posts fetched successfully!",
          posts: fetchedPosts,
          maxPosts: count
        });
      });
  });

router.get('/:id', multer({storage: storage}).single("image"), (req, res, next) => {
    Post.findById(req.params.id).then(resp => {
        if (resp) {
            console.log(resp);
            res.status(200).json(resp)
        }
        else {
            res.status(404).json({ message: "Post not found" })
        }
    })
})

router.put('/:id', checkAuth ,multer({storage: storage}).single("image"), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + '/images/' + req.file.filename
    }
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });
    console.log(post);
    Post.updateOne({ _id: req.params.id }, post)
        .then(resp => {
            console.log(resp);
            res.status(200).json({ message: "update successful" })
        });
});

router.delete('/:post', checkAuth ,(req, res, next) => {
    // console.log(req);
    const id = req.params.post;
    console.log(id);
    Post.deleteOne({
        _id: id
    })
        .then(resp => {
            console.log(resp);
            res.status(200).json({
                message: "Post Deleted Successfully",
                postId: id
            });
        })


});

module.exports = router;