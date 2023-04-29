const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Topic Schema
const topicschema  = new mongoose.Schema(
  {
      top : {
          type : String,
      }
  }
);

// Function to check topic exists
topicschema.statics.check = async function(top)
{
  const topic = await this.findOne({top});
  if(topic)
  {
      return topic._id;
  }
}
const Topic = mongoose.model('topic', topicschema);

module.exports = Topic;