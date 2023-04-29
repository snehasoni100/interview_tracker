const User = require("../models/User");

module.exports.send_request = async (req,res) => {
    console.log("work");
    const {name,byname} = req.body;
    console.log(name);

  let user = await User.find({username:name}).exec();
  let byUser = await User.find({username:byname}).exec();
    
    if (!user)
    {
        console.log("badd");
        res.status(404).json({
            status: 'BadRequest'
        });
    }
    const byuser = byUser[0]._id;
    const touser = user[0]._id;
    console.log(user);
    if(user[0].pendingRequest.includes(byuser)=== false)
    {
        await User.findByIdAndUpdate(touser,{pendingRequest:[...user[0].pendingRequest,byuser]});
        console.log(user);
    }
  

    

}
module.exports.accept_request=async (req,res)=>
{
    const byu = await User.findOne({ username: req.params.name1 });
    const tou = await User.findOne({ username: req.params.name2 });
    

    const byus= byu._id;

   const tous = tou._id;
   console.log(byu)
     console.log(tou)  
   // let pendingRequestby = byu.pendingRequest.filter(e=>e._id!=tous);
   
    if(byu.acceptedRequest.includes(tous)=== false)
    {
    await User.findByIdAndUpdate(byus,{acceptedRequest:[...byu.acceptedRequest,tous]});
    }
    if(tou.acceptedRequest.includes(byus)=== false)
    {
        await User.findByIdAndUpdate(tous,{acceptedRequest:[...tou.acceptedRequest,byus]});
    }
    let pendingRequestby=byu.pendingRequest.remove(tous);
    await User.findByIdAndUpdate(byus,{pendingRequest:pendingRequestby});
    
    var names = [];
    var ema=[];
     
    for(i=0;i<byu.pendingRequest.length;i++)
    {
        const user=await User.findById({_id:byu.pendingRequest[i]});
          var result = user.username +" ";
          var r=user.email+" ";
     
    names.push(result);
    ema.push(r);
    }
   
    res.render('friends',{names:names,ema:ema}); 
     console.log(byu)
     console.log(tou)    
       
    }

module.exports.friends=async (req,res)=>
{
    const byu = await User.findOne({ username: req.params.name });
    var names = [];
    var ema=[];
  
    for(i=0;i<byu.acceptedRequest.length;i++)
    {
        const user=await User.findById({_id:byu.acceptedRequest[i]});
          var result = user.username +" ";
          var r=user.email+" ";
     
    names.push(result);
    ema.push(r);
    }
   
    res.render('frnd',{names:names,ema:ema}); 
      
}
module.exports.all_requests=async (req,res)=>
{
    const byUser = await User.findOne({ username: req.params.name });
    var names = [];
    var ema=[];
   if(byUser)
   {
    for(i=0;i<byUser.pendingRequest.length;i++)
    {
        const user=await User.findById({_id:byUser.pendingRequest[i]});
          var result = user.username +" ";
          var r=user.email+" ";
     
    names.push(result);
    ema.push(r);
    }
   
        res.render('friends',{names:names,ema:ema}); 
        // console.log(names)
    }
 
   
   else
   {
    res.status(404).json({
        status: 'BadRequest'
    });
   }
   
}
module.exports.get_user = (async (req, res, next) => {
    let user = await User.findOne({ username: req.params.username });
    if (!user)
    {
        res.status(404).json({
            status: 'BadRequest'
        });
    }
    res.status(200).json({
        status: 'success',
        user
    });
    
});
module.exports.all_user = async (req,res,next)=>
{
    const users = await User.find();
    if (!users)
    {
        console.log('error in users');
        res.status(404).json({
            status: 'BadRequest'
           
        });
    };
    //res.render('friends',{u:users.username});
    var names = [];
    var ema=[];
    for(i=0;i<users.length;i++){
     var result = users[i].username +" ";
     var r=users[i].email+" ";
       
       names.push(result);
      ema.push(r);
      }
    console.log(names);
    res.render('friends',{names:names});                                                                                                                                                                 ;
      
   
}