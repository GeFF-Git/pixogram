const express = require("express");
const Post = require('../models/post');
const multer = require('multer');
const router = express.Router();

const MIME_TYPE = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg"
}

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        const isValid = MIME_TYPE[file.mimetype];
        const message = new Error("Invalid MIME type");
        if (isValid) {
            message = null;
        }
        cb(message,"backend/images"); // Path is relative to server.js file therefore we have the path as "backend/images"
    },
    filename: (req,file,cb)=>{
        const fileName = file.originalname().toLowerCase().replace(' ','-');
        const extension = MIME_TYPE[file.mimetype];
        cb(null,fileName + '-' + Date.now() + '.' + extension);
    }    
});

// multer(storage).single("image") means that multer expects a single file with image property
router.post('', multer(storage).single("image"), (req, res, next) => {
    // const post = req.body;
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    })
    console.log(post);
    post.save().then(resp => {
        console.log(resp);
        res.status(201).json({
            message: 'Post added successfully',
            postId: resp._id
        })
    });
});

router.get('', (req, res, next) => {
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
    Post.find().then(documents =>
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

router.get('/:id', (req, res, next) => {
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

router.put('/:id', (req, res, next) => {
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({ _id: req.params.id }, post)
        .then(resp => {
            console.log(resp);
            res.status(200).json({ message: "update successful" })
        });
});

router.delete('/:post', (req, res, next) => {
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