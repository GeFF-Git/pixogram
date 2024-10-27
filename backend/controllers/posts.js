const Post = require('../models/post');

exports.createPost = (req, res, next) => {
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
    })
    .catch(error => {
        res.status(500).json({
            message: 'Post creation failed!'
        })
    });
}

exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + '/images/' + req.file.filename
    }
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    console.log(post);
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
        .then(result => {
            console.log(result);
            if (result.matchedCount > 0) {
                res.status(200).json({ message: "Update successful" })
            }
            else {
                res.status(401).json({message: "User not authorized"});
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Couldn\'t update post!'
            })
        });
}

exports.getAllPosts = (req, res, next) => {
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
      })
      .catch(error => {
        res.status(500).json({
            message: 'Couldn\'t fetch posts!'
        })
    });
  }

  exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then(resp => {
        if (resp) {
            console.log(resp);
            res.status(200).json(resp)
        }
        else {
            res.status(404).json({ message: "Post not found" })
        }
    })
    .catch(error => {
        res.status(500).json({
            message: 'Couldn\'t fetch the post!'
        })
    })
}

exports.deletePost = (req, res, next) => {
    // console.log(req);
    const id = req.params.post;
    console.log(id);
    Post.deleteOne({
        _id: id,
        creator: req.userData.userId
    })
        .then(result => {
            console.log(result);
            if (result.deletedCount > 0) {
                res.status(200).json({ message: "Deletion successful" })
            }
            else {
                res.status(401).json({message: "User not authorized"});
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Post deletion unsuccessful!'
            })
        })
}







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