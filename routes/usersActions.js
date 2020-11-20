const express = require('express');
// const User = require('../models/User');
const Post = require('../models/Post');
const { postSchema, commentSchema } = require('../requests/validation_schema');
const createError = require('http-errors');
// const _ = require('lodash');

const { verifyAccessToken } = require('../utils/generateTokens');
// const { request } = require('express');

const router = express.Router();
app.use(express.json());




router.post('/post', verifyAccessToken, async (req, res, next)=> {
    try{
        const result = await postSchema.validateAsync(req.body);
        if(result.comment_text != ''){            
            // request.user_id = req.user;
            // request.like_count = 0;
            // request.start_count = 0;

            // console.log(request);
            // const post = new Post(request);
           
            const post = new Post({
                user_id: req.user,                
                caption: result.caption,
                img_link: result.img_link,
                like_count: 0,
                star_count: 0
            });
            const updatedPost = await post.save();
            // console.log('User Post: '+ updatedPost._id);

            res.send({"message" : "your post published successfully"});
        }else{
            
            // console.log(`error exists in your comments ${result.comment_text}.`);
            return next(createError.Conflict(`Errors Exists in ${results.comment_text}.`) );
        }
        // res.status(200).send({"message":"I am from User's Post: "+req.user.firstname});
    }catch(err){

        next(err);
    }
});




router.post('/post/comment', verifyAccessToken, async (req, res, next)=> {
    try{
        const result = await commentSchema.validateAsync(req.body);
        // console.log(result.post_id);
        // const post = Post.findById(result.post_id, (err, post)=>{
        // if(err) {
        //    console.log(err); 
        //    return next(createError.Conflict(`Errors Exists in ${results.comment_text}.`) );
        // }
        //    console.log(post);
        // });
        
        const post = await Post.findById(result.post_id).exec();
        if(post != null){
            // console.log(post);
        }else{
            console.log('Errror in comment save');
            return next(createError.Conflict(`Errors Exists in ${results.comment_text}.`) );
        }

        const comment = new Comment({
            user_id: req.user,
            post_id: post,
            comment_text: result.comment_text,
        });
        const updatedComment = await comment.save();
        // console.log('User Comment:'+ updatedComment);


        
        // null if error
        res.send({"message" : "your comment published successfully"});            

        

    }catch(err){

        next(err);
    }
});









module.exports = router;

