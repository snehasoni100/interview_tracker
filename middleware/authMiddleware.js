const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Image = require('../models/Image');
const admin = require('../dummyadmin');
const multer=require('multer');
// const Image=require('../models/Image');
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage }).single('image');
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'net ninja secret', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

const adminAuth = async (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(token)
  //check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } 
      else {
        let id= decodedToken.id;
        const p = await User.addmin(id);
        const email=p.email;
        let swag = admin.admins();
        var i=0;
        while(i<swag.length)
            {
              if(swag[i].email==email){
                break;
              }
              else{
                i++;
              }
            }
            if(i==swag.length)
            {
              res.redirect('/')
            }
            else
            {
              next();
            }
        
      }
    });
  } else {
    res.redirect('/login');
  }
};
// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.locals.image = null;
        next();
      } else {
        let users = await User.findById(decodedToken.id);
        const image = await Image.findOne({user:users});
        res.locals.user = users;
        res.locals.image = image;
        next();
      }
    });
  } else {
    res.locals.user = null;
    res.locals.image = null;
    next();
  }
};


module.exports = { requireAuth, checkUser,adminAuth };