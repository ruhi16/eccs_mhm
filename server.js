const express = require('express');
const createError = require('http-errors');
const config = require('config');
require('dotenv').config();

const connectDb = require('./utils/database');
connectDb();

app = express();
app.use(express.json()); //{extended:false}



app.get('/', (req, res, next)=>{
    res.send({"message":"Hello World: " + config.get('dbconn.mongodbURI') + " Config Env: " + process.env.mongo_uri + " Node Env:" + process.env.NODE_ENV}); 
});

app.get('/ping', (req, res, next)=>{
    res.send({"message":"It is now live!!!"});
});



// for user authenticaations
const userRoutes = require('./routes/users');
app.use('/api', userRoutes);



// for club data with image upload
app.use('/uploads',express.static('uploads'));

const clubRoutes = require('./routes/clubRoutes.js');
app.use('/api/clubs', clubRoutes);



// for user's actions eg. post, commnts, likes or reviews
const userActions = require('./routes/usersActions.js');
app.use('/api/users', userActions);



// app.post('/api/users/OTP_vefiry', (req, res, next)=>{

//     res.send({"message" :"otp is "+req.payload});
// });













// For any unkown http BROWSER requests
app.use((req, res, next)=>{
    next(createError.NotFound('Page Not Found.....'));
});




// Error handler for http REST API requests
app.use( (err, req, res, next) => {
    res.status(err.status || 500);
    
    var errField = err.message.split('"')[1];

    res.send({
        status: err.status || 500,        
        error: {
            field: errField,
            message: err.message            
        }
    });
});






const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log(`Hello I am listening from port no ${port}`);
})