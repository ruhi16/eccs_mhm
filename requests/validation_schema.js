const Joi = require('@hapi/joi');

const authSchema = Joi.object({
    firstname: Joi.string().min(5).max(30).required(),
    lastname: Joi.string().min(2).max(20).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(4).max(20).required(),    
});




const loginSchema = Joi.object({    
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(4).max(20).required(),
    
});




const postSchema = Joi.object({    
    caption: Joi.string().max(50),
    img_link: Joi.string().max(200),
});




const commentSchema = Joi.object({
    post_id: Joi.string().max(24),
    comment_text: Joi.string().min(4).max(300).required()    
});


module.exports = {authSchema, loginSchema, postSchema, commentSchema};