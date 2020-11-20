const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const commentSchema = new Schema({    
    user_id: {type: Schema.Types.ObjectId, ref:'User', required: true},
    post_id: {type: Schema.Types.ObjectId, ref:'Post', required: true},    
    comment_text:   {type: String, required: true},
    date:           {type: Date, default: Date.now },
    
    is_reported:    {type: Boolean},
    reported_uid:   {type: String},
    reported_date:  {type: Date},
});

module.exports = Comment = mongoose.model('Comment', commentSchema);
