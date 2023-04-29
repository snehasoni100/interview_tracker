const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema ;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required:true,
    unique:true,
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
  // sentRequest:[
  
  //   {
      
  //     type: Schema.Types.ObjectId,
  //     ref: 'users'
      
  //   }
   
  // ],
  pendingRequest:
  [{
   
      type: Schema.Types.ObjectId,
      unique:true,
      ref: 'user'
      
  
    
    
  }],
  acceptedRequest:[{
   
       type: Schema.Types.ObjectId,
       unique:true,
       ref: 'user'
   
     
     
   }]


});


// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};
userSchema.statics.addmin = async function(id)
{
  const user = await this.findById(id).exec();
  if(user)
  {
    return user;
  }
  
}
const User = mongoose.model('user', userSchema);

module.exports = User;
 