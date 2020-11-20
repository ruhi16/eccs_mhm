const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/User');


module.exports = {
    signAccessToken : (userId) =>{
        return new Promise( (resolve, reject)=>{
            const payload = {};
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn: '7d',
                issuer: 'rawsolutions.in',
                audience: userId.toString(),
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if(err) reject(err);
                resolve(token);
            });
        });
    },

    signRefreshToken : (userId) =>{
        return new Promise( (resolve, reject)=>{
            const payload = {};
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: '30d',
                issuer: 'rawsolutions.in',
                audience: userId.toString(),
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if(err) reject(err);
                resolve(token);
            });
        });
    },

    verifyAccessToken : (req, res, next) => {
        if( !req.headers['authorization'] ){
            return next(createError.Unauthorized());
        }
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];
        
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
            if(err) return next(createError.Unauthorized());//err.message
            
            const user = await User.findOne({ _id: payload['aud']});
            
            // try{
            //     if( token != user.access_token) {
            //         // return ( next(createError.Unauthorized()) );
            //         console.log('unauthorized user');
            //         return next(createError.Unauthorized());
                    
            //     }

            // }catch(err){
            //     console.log(err);
            //     // next(createError.Unauthorized());
            // }

            req.user = user;
            req.payload = payload;
            next();
        });
    },



    verify4digitOTP : (req, res, next) => {
        console.log('xxx:'+req.user.email_otp);
        
        if(req.user.email_otp != ''){
            console.log('otp is not null');
            return next( createError.Unauthorized('OTP not verified') );   
        }        
        next();
    },

    
}
