
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const Image=require('../models/Image');
const Topic=require('../models/TopicsModel');
const Question=require('../models/QuestionModel');
var DOMParser=require('dom-parser');
var axios=require('axios');
var cheerio=require('cheerio');
const multer=require('multer');

var parser= new DOMParser();
const path=require('path');
const fs=require('fs');


// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge
  });
};



module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}



module.exports.signup_post = async (req, res) => {
  const { username,email, password } = req.body;
   
  try {
    const user = await User.create({ username,email, password});
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
    console.log(user)
   
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    const use = await User.find({email:email}).exec();
    const users = use[0]._id;
    const image = await Image.findOne({user:users});
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id});
  } 
  catch (err) {

    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}
module.exports.admin_get = async (req,res) =>
{
     res.render('admin');
}
module.exports.admin_post = async (req,res) =>
{
  const {name , linkto , top } = req.body;
  console.log(req.body);
  try { 
    
    const tops =await Topic.find({
      top:top
    }).exec();
    if(tops[0])
    { 
      const topic = tops[0]._id
      const question = await Question.create({name, linkto, topic});
      console.log(question)
      res.status(201).json({ question: question._id });
    }
    else
    { 
      const d = await Topic.create({top});  
      const topic = d._id;
      // console.log(id)
      const question = await Question.create({name, linkto,topic});
    }

  }
  catch (err) {
    res.status(400).json({err});
  }
  console.log('finished')
}
module.exports.topic_get = async (req,res) =>
{
   Topic.find({},(err,data) => {
     if(err){
       console.log(err);
     }
     else
     {
       res.render('smoothies',{smoothies:data});
     }
   })
}

async function getItems(){

  const Items = await Topic.find({});
  
  return Items;

}
async function getQuestions(c){

  const Item = await Question.find({topic:c});
  return Item;
  
}


module.exports.question_get = (req,res) =>
{
   const str = req.params.name;
   getItems().then(function(d){
    
    let c=0
    for(var i=0;i<d.length;i++)
   {
     if(d[i].top==str)
     {
            c= d[i]._id;
      }
    }
    getQuestions(c).then(function(data)
    {
      if(data)
      {
        res.render('questions',{questions:data,topicname:str});
      }
    });
  
   });
  }
  

 module.exports.questiondata_get = async (req,res)=>
 {
           const url=req.query.url;
           console.log(url)
        
        axios.get(url).then((response)=>
        {
         
          const htmlData=response.data;
          const $ =cheerio.load(htmlData);
          const head=$('.skeleton',htmlData).children('.navigation').children('.title-block').children('h3').text();
        const Datatitle=$('.skeleton',htmlData).children('.navigation').children('.title-block').children('h1').text();
        const constraints=$('.skeleton',htmlData).children('.content-wrapper').children('.content').children('.task-constraints').text();
       const input=$('.skeleton',htmlData).children('.content-wrapper').children('.content').text();
        //const input=$('.skeleton',htmlData).children('.content-wrapper').children('.content').children('constraints').text();
       const st = input.search("MB");
       const en = input.search("Input");
      
       const pb = input.substring(st+2,en);
       const s= input.search("Input");
       const e = input.search("Output");
      
      const inp = input.substring(s+5,e);
      const so= input.search("Output");
      const eo= input.search("Example");
     
     const out = input.substring(so+6,eo);
     const exm = input.substring(eo+7);
       //console.log(out) ;
          res.render('questionData',{url:url,head:head,tit:Datatitle,con:constraints,pb:pb,inp:inp,out:out,exm:exm});
        }).catch((error)=>
        console.log(error)); 
 }
