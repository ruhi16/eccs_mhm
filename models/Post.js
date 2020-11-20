const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const postSchema = new Schema({            
    user_id:    {type: Schema.Types.ObjectId, ref: 'User', required: true},
    caption:    {type: String},
    img_link:   {type: String},
    like_count: {type: Number},
    star_count: {type: Number},
    date:       {type: Date, default: Date.now },
    
    is_reported:    {type: Boolean},
    reported_uid:   {type: String},
    reported_date:  {type: Date},
});

module.exports = Post = mongoose.model('post', postSchema);


