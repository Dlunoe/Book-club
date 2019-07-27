const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/'+'books';
const Schema = mongoose.Schema;

mongoose.connect(mongoURI, { useNewUrlParser: true }, () => {
    console.log('the mongo connection is established');
})

const bookSchema = new mongoose.Schema ({
    title: String,
    author: String,
    genre: String,
    cover: String,
    nextBook: String,
    clubRead: String,
    clubSuggest: String,
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:false
    },
}, {timestamps: true})

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;

