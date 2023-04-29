const mongoose = require('mongoose');
const Schema = mongoose.Schema ;
const commentSchema = mongoose.Schema({
    text: {
       
        type: String,
       
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: 'questions'
    },
});
const Comment = mongoose.model('comment', commentSchema);
module.exports = Comment;