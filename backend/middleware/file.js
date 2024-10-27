const multer = require('multer');

const MIME_TYPE = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg"
}

// multer(storage).single("image") means that multer expects a single file with image property

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

module.exports = multer({storage: storage}).single("image");