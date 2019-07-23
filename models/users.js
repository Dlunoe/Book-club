const mongoose = require('mongoose');
const Sceham = mongoose.Schema;

const userSchema = new Schema({
    username:{type:String, unique:true, required: true},
    password:{type: String, required: true},
    readingList:{type: Array}
});

const User = mongoose.model("User", userSchema);
module.exports(User);