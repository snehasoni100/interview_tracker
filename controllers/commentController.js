const User = require("../models/User");
const Comment=require("../models/comment");
const Question=require("../models/QuestionModel");
module.exports.comment=async (req,res)=>
{
    const { userid } = req.body;
    const { queid } = req.body;
    const { txt } = req.body;
    
    const comment = await Comment.create({ text:txt, user: userid,question: queid, });
    res.status(200).json({
        status: 'success',
        comment
    })
    const user=await User.findById({_id:userid});
    const ques=await Question.findById({_id:queid});
    console.log(txt)
   console.log(comment)
    console.log(ques);
}
module.exports.getComment = async (req, res) => {
    console.log("work"+req.params.id)
    const id = req.params.id;
    const comment = await Comment.findOne({question:id});
    res.status(200).json({
        status: 'success',
        comment
    });
    console.log(comment)
}
exports.getAllComment = async (req, res) => {
    const comments = await Comment.find();
    res.status(200).json({
        status: 'success',
        comments
    });
   // console.log(comments)
}
