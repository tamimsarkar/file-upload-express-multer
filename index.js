const express = require('express');
const multer = require('multer')
const path = require('path')
const UPLOADS_FOLDER = './uploads/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_FOLDER)
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const filename = file.originalname.replace(fileExt,"").toLowerCase().split(" ").join("-") + "-" + Date.now();
        cb(null, filename + fileExt)
    }
})
const upload = multer({
    storage:storage,
    limits: {
        fileSize: 1000000,  // 1 mb
    },
    fileFilter: (req, file, cb) => {
    
     
        if(file.fieldname === 'avatar'){
            if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
                cb(null,true)
            }else {
                cb(new Error(`Only jpg, png, jpeg format allowed!`))
            }
        }else if(file.fieldname === 'doc'){
           if(file.mimetype === 'application/pdf'){
               cb(null, true)
           }else {
               cb(new Error(`Only pdf format allowed`))
           }
        }else {
            cb(new Error(`There is an unknown error accourd!`))
        }
    }
})

const app = express();

app.post('/',upload.fields([
    {name: 'avatar', maxCount: 1},
    {name: 'doc', maxCount: 1},
]),(req, res) => {
    res.send('hello world')
})

app.use((err,req,res,next) => {
    if(err){
        if(err instanceof multer.MulterError){
            res.status(500).send('there was an upload error.')
        }else{
            res.status(500).send(err.message)
        }
    }else {
        res.send(`success`)
    }
})
app.listen(3000,() => {console.log(`listenning on port 3000`)})