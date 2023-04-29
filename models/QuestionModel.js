const mongoose = require('mongoose');
const Schema = mongoose.Schema ;

const questionschema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        // Cses Link
        linkto:
        {
            type: String,
        },
        // specifying that storing topic ref (Setting Up Relation)
        topic: {
            type: Schema.Types.ObjectId,
            ref: 'topics'
        }
    }
)
const Question = mongoose.model('questions',questionschema);
module.exports = Question;