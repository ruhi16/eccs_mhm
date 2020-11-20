const express = require('express');
const User = require('../models/User');
const { authSchema, loginSchema } = require('../requests/validation_schema');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const _ = require('lodash');

const { signAccessToken, signRefreshToken, verifyAccessToken, verify4digitOTP } = require('../utils/generateTokens');

const router = express.Router();
app.use(express.json());






function makeRandomString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

router.post('/register', async(req, res, next)=>{
    try{
        const results = await authSchema.validateAsync(req.body);
        const doesExists = await User.findOne({email:results.email});
        if(doesExists){
            console.log(`email ${results.email} exists...`);
            return next(createError.Conflict(`This ${results.email} already exists...`) );
            // throw createError.Conflict(`This ${results.email} already exists...`);
            // next(createError.Conflict(`This ${results.email} already exists...`) );
            // return;
        }
        
        const salt = await bcrypt.genSalt(10);
        results.password = await bcrypt.hash(results.password, salt);  
        
        
        results.email_otp = Math.floor(1000 + Math.random() * 9000);
        results.email_validation_link = makeRandomString(20);
        results.is_otp_validated = false;
        // results.access_token = 'abcd';
        const user = new User(results);
        const savedUser = await user.save();
        // console/log(savedUser);

        user.access_token = await signAccessToken(savedUser._id);
        user.refresh_token = await signRefreshToken(savedUser._id);

        // console.log(results);
        const updatedUser = await user.save();
        
        // console.log(updatedUser);


        
        // var transporter = nodemailer.createTransport({
        //     service:process.env.BASE_EMAIL_SERVICE,
        //     auth: {
        //         user: process.env.BASE_EMAIL_ID,
        //         pass: process.env.BASE_EMAIL_PW
        //     }
        // });


        //login in mailtrap.io with hndas2020@gmail.com
        var transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "493833c29fc569",
              pass: "9df19a2f7aefba"
            }
          });

        let mailOptions = {
            from: process.env.BASE_EMAIL_ID,
            to: results.email,
            subject: 'Requested OTP for new registered user email validation.',
            // html: ``
            text: `Hello ${results.firstname}, This is your otp: ${results.email_otp} requested.
                        Email validation link is: ${results.email_validation_link}`,
        };

        transporter.sendMail(mailOptions, function(err, info){
            if(err){
                console.log('Error occured in email send: '+err);
            }else{
                console.log('Email sent successfully: '+info.response);
            }
        });


        res.status(200).send(_.pick(updatedUser, ['id', 'firstname', 'lastname', 'is_otp_validated', 'access_token', 'refresh_token']));
    }catch(error){             
        if(error.isJoi){
            error.status = 422;
            next(error);
        }
    }    
});


router.post('/login', async(req, res, next)=>{  
    try{
        const results = await loginSchema.validateAsync(req.body);
        
        const user = await User.findOne({email:results.email});
        if(!user){
            console.log('User not registered...');
            // throw createError.NotFound('User Not Registered...');
            return next(createError.Conflict(`This ${results.email} or password does not matched...`) );
            // return;
        }
        
        const isMatched = await user.isValidPassword(results.password);
        if(!isMatched){
            throw createError.NotFound(`This ${results.email} or password does not matched...`);
        }        


        user.access_token = await signAccessToken(user._id);
        user.refresh_token = await signRefreshToken(user._id);

        const updatedUser = await user.save();

        res.status(200).send(_.pick(updatedUser, ['id', 'firstname', 'lastname', 'is_otp_validated', 'access_token', 'refresh_token']));


    }catch(error){             
        if(error.isJoi === true){
            return next(createError.BadRequest('Invalid username/password...'));
        }

        next(error);
    } 


});







router.get('/users/OTP_resend', verifyAccessToken, async(req, res, next)=>{

    try{
        

        req.user.email_otp = Math.floor(1000 + Math.random() * 9000);
        req.user.email_validation_link = makeRandomString(20);
        req.user.is_otp_validated = false;
        console.log(req.user.email_otp);
        updatedUser = await req.user.save();

        if(updatedUser == null){
            return next(createError.Unauthorized('Some error has been occured, try again'));
        }
        // var transporter = nodemailer.createTransport({
        //     service:process.env.BASE_EMAIL_SERVICE,
        //     auth: {
        //         user: process.env.BASE_EMAIL_ID,
        //         pass: process.env.BASE_EMAIL_PW
        //     }
        // });

        //login in mailtrap.io with hndas2020@gmail.com
        var transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "493833c29fc569",
              pass: "9df19a2f7aefba"
            }
          });

        let mailOptions = {
            from: process.env.BASE_EMAIL_ID,
            to: req.user.email,
            subject: 'Requested OTP to resend for new registered user email validation.',
            // text or html: ``
            text: `Hello ${req.user.firstname}, This is your otp: ${req.user.email_otp} requested.
            Email validation link is: ${req.user.email_validation_link}`,
        };

        transporter.sendMail(mailOptions, function(err, info){
            if(err){
                console.log('Error occured in email send: '+err);
                res.status(200).send({"message":"otp resend failure","user":_.pick(user, ['id', 'firstname', 'lastname', 'email'])});
            }else{
                console.log('Email sent successfully: '+info.response);
                res.status(200).send({"message":"otp resend successfully","user":_.pick(user, ['id', 'firstname', 'lastname', 'email'])});
            }
        });

        
        // res.status(200).send(_.pick(updatedUser, ['id', 'firstname', 'lastname', 'is_otp_validated', 'access_token', 'refresh_token']));
    }catch(error){
        if(error.isJoi){
            error.status = 422;
            next(error);
        }
    }
    


    // res.status(200).send({"message" :"otp resend..."});
});




router.post('/users/OTP_vefiry', verifyAccessToken, async(req, res, next)=>{
    
    const user = await User.findOne({ _id: req.payload['aud']});        

    if(user.email_otp == ''){
        res.status(200).send({
            "message":"otp already verified",
            "user":_.pick(user, ['id', 'firstname', 'lastname', 'email'])
        });       
    }else 
    if( req.body.otp != '' && user.email_otp == req.body.otp ){        
        user.email_otp ='';
        // await user.save();        
        res.status(200).send({
            "message":"otp verified",
            "user":_.pick(user, ['id', 'firstname', 'lastname', 'email'])
        });

    }else{            
        res.status(200).send({
            "message":"otp not verified",
            "user":_.pick(user, ['id', 'firstname', 'lastname', 'email'])
        });

    }

});





router.get('/users', verifyAccessToken, async(req, res, next)=>{
    
    const user = await User.findOne({ _id: req.payload['aud']});

    
    res.status(200).send(_.pick(user, ['id', 'firstname', 'lastname', 'email']));


});



router.post('/logout', verifyAccessToken, async(req, res, next)=>{
    
    const user = await User.findOne({ _id: req.payload['aud']});

    user.access_token = '';
    user.refresh_token = '';

    await user.save();
    
    res.status(200).send({message:"User Successfully Logged Out..."});


});




module.exports = router;

