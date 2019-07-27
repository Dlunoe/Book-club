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

const Book = require('./models/books');
const booksController = require('./controllers/booksController');

const Club = require('./models/clubs');
const clubsController = require('./controllers/clubsController');

//MIDDLEWEAR
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(session({
    secret:"gotstokeepit",
    resave:false,
    saveUninitialized:false
}))
app.use((req,res,next)=>{
    res.locals.currentUser = req.session.user;
    next();
})

//HOME PAGE
app.get('/', (req, res) => {
    Club.find({}, (err, clubs) => {
        res.render('./clubs/index.ejs', {
            clubIndex: clubs, 
        });
    })
    Book.find({nextBook: "Yes"}, (err, book) => {
        next = book
        console.log(next[0].title);
    })
})

app.use("/books", booksController);
app.use("/users", usersController);
app.use("/clubs", clubsController);


app.listen(3000, () => {
    console.log("The app is running");
});