const multer=require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const User = require("../models/User");
const Image = require("../models/Image");


module.exports.imageupload_get = (req,res) => {
    res.render('imageupload');
}
async function getUser(c){
    const user = await User.find({email:c});
    return user;
}
module.exports.imageupload_post = async (req,res) =>
{
 const curentUSer = req.query.User;
    const use = await User.find({email:curentUSer}).exec();
    const user = use[0]._id;
    console.log(user);
    const image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,   
    };
    const newimage = await Image.create({image,user});
    res.redirect('/');
}

module.exports.image_get = async (req,res) =>
{
    const curentUSer = req.query.User;
    const use = await User.find({email:curentUSer}).exec();
    const user = use[0]._id;
    const image = await Image.findOne({user:user});
    if(image)
    {
        //console.log(image)
        res.render('images', { images: image });
    }
    else
    {
        
    res.render('imag');
    }
    
}