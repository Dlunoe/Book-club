const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/'+'books';

mongoose.connect(mongoURI, { useNewUrlParser: true }, () => {
    console.log('the mongo connection is established');
})

const clubSchema = new mongoose.Schema ({
    clubName: String,
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:false
    },
}, {timestamps: true})

const Club = mongoose.model('Club', clubSchema);
module.exports = Club;

