const mongoose = require('mongoose');
const Schema = mongoose.Schema ;

const imageSchema = new mongoose.Schema({

    image: {
      data: Buffer,
      contentType: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users'
  }
  });
  const Image = mongoose.model('Image', imageSchema);
  module.exports=Image;