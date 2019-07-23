const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session=require('express-session')
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const mongoURI = 'mongodb://localhost:27017/'+'books';
const db = mongoose.connection;

mongoose.connect(mongoURI, { useNewUrlParser: true }, () => {
    console.log('the mongo connection is established');
})

const User = require('./models/users');
const usersController= require('./controllers/usersController')

const Book = require('./models/users');
const booksController = require('./controllers/booksController');


//MIDDLEWEAR
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(session({
    secret:"gotstokeepit",
    resave:false,
    saveUninitialized:false
}))



//SEED ROUTE
//Can be used to send some intial data for testing.
// app.get('/books/seed',(req, res)=>{
//     Book.create([
//         {
//             title: 'The Alice Network',
//             author: 'Alice Quinn',
//             genre: 'Historical Fiction'
//         },
//         {
//             title: 'Where the Crawdads Sing',
//             author: 'Delia Owens',
//             genre: 'Fiction'
//         },
//         {
//             title: 'The Silent Patient',
//             author: 'Alex Michaelides',
//             genre: 'Thriller'
//         }
//     ], (err, data)=>{
//         res.redirect('/books');
//     })
// });

app.use("/books", booksController);
app.use("/users", usersController)


app.listen(3000, () => {
    console.log("The app is running");
});