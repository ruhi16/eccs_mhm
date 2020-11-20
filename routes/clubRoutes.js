const express = require('express');
const createError = require('http-errors');
const multer = require('multer');
const _ = require('lodash');

const Club = require('../models/ClubModel');

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);

    }
});

const fileFilter = (req, file, callback) => {
    if( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        callback(null, true);
    }else{
        callback(null, false);
    }
};


const upload = multer({
    storage: storage,
    limits: {fileSize: 1024*1024*5},
    fileFilter: fileFilter
})


const router = express.Router();
app.use(express.json());



router.get('/', async  (req, res, next) => {
    res.send('all clubs registered details');
    
});

router.post('/register', upload.single('clubImage'), async (req, res, next) => {
    console.log(req.file.path);
    console.log(req.body);


    const club = new Club();
    club.name = req.body.name;
    club.imageUrl = req.file.path;
    
    const savedClub = await club.save();
    
    console.log(savedClub);

    res.status(200).send('club register page submit response')



});




















module.exports = router;

