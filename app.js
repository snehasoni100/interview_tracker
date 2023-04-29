const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const path=require('path');
const Image=require('./models/Image');

const cookieParser = require('cookie-parser');
const multer=require('multer');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();
app.use(express.urlencoded({ extended: true }));

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));


//const dbURI = 'mongodb+srv://cluster0.pnpuz.mongodb.net/node-auth3';
//const dbURI = 'mongodb+srv://sonisneha1001:test1234@cluster0.74ffdfl.mongodb.net/user';
const dbURI = 'mongodb+srv://sneha:test1234@cluster0.qhj5jf4.mongodb.net/node-auth';

mongoose.connect(dbURI)
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

  app.get('*',checkUser);
  app.get('/', async(req, res) => res.render('home'));
 
  app.get('/smoothies', requireAuth, async(req, res) => res.render('smoothies'));
  
  app.use(authRoutes);

  const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// app.get('/images',requireAuth, async (req, res) => {
//   const images = await Image.find().sort({_id:-1});
 
//   res.render('images', { images: images });
// });
 

