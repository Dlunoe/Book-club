const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const userSchema = new Schema({
    username:{type:String, unique:true, required: true},
    password:{type: String, required: true},
    readingList:[{
        type:mongoose.Schema.Types.Mixed,
        ref:"Book",
        required:false
    }],
    finishedList:[{
        type:mongoose.Schema.Types.Mixed,
        ref:"Book",
        required:false
    }]
});

const User = mongoose.model("User", userSchema);
module.exports=User;