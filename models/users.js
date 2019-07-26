const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const userSchema = new Schema({
    username:{type:String, unique:true, required: true},
    password:{type: String, required: true},
    readingList:[{
        title: String,
        author: String,
        genre: String,
    }],
    finishedList:{type:Array, "default":[]}
});

const User = mongoose.model("User", userSchema);
module.exports=User;