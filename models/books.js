const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/'+'books';

mongoose.connect(mongoURI, { useNewUrlParser: true }, () => {
    console.log('the mongo connection is established');
})

const bookSchema = new mongoose.Schema ({
    title: String,
    author: String,
    genre: String,
}, {timestamps: true})

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;


// const books = [{
//     title: 'The Alice Network',
//     author: 'Alice Quinn',
//     genre: 'Historical Fiction'
// } , {
//     title: 'Where the Crawdads Sing',
//     author: 'Delia Owens',
//     genre: 'Fiction'
// } , {
//     title: 'The Silent Patient',
//     author: 'Alex Michaelides',
//     genre: 'Thriller'
// }];

// module.exports = books;