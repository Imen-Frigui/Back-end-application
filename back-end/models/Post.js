const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const PostSchema = mongoose.Schema({
    PostTitle: {
        type: String,
        required: true,
        unique: true
    },
    Details: {
        type: String,
        unique: true
    },
    author: {
        
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

},{
    timestamps: true
});

PostSchema.plugin(uniqueValidator);

const Post = module.exports = mongoose.model('Post', PostSchema);
