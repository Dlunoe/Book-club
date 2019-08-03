const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session=require('express-session')
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/books',
    collection: 'mySessions'
  });

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
    store:store,
    resave:true,
    saveUninitialized:true
}))
app.use((req,res,next)=>{
    res.locals.currentUser = req.session.user;
    if(req.session.message){
        res.locals.message=req.session.message;
        req.session.message=null;
    }
    next();
})

function seed(book) { 
    Book.create([
        {
            title: 'The Alice Network',
            author: 'Alice Quinn',
            genre: 'Historical Fiction',
            cover: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1492238040l/32051912.jpg',
            // nextBook: String,
            clubRead: 'Yes',
            // clubSuggest: String,
        },
        {
            title: 'Where the Crawdads Sing',
            author: 'Delia Owens',
            genre: 'Fiction',
            cover: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1524102644l/36809135.jpg',
            clubRead: 'Yes',
        },
        {
            title: 'The Silent Patient',
            author: 'Alex Michaelides',
            genre: 'Thriller',
            cover: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1550161053l/40097951._SY475_.jpg',
            clubRead: 'Yes'
        },
        {
            title: 'The 7.5 Deaths of Evelyn Hardcastle',
            author: 'Stuart Turton',
            genre: 'Mystery',
            cover: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1506896221l/36337550.jpg',
            nextBook: 'Yes'
        },
        {
            title: 'Boy Swallows Universe',
            author: 'Trent Dalton',
            genre: 'Fiction',
            cover: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1519792733l/37558445._SY475_.jpg',
            clubSuggest: 'Yes'
        }
    ], (err, data)=>{
        
    })
    } 




//HOME PAGE
app.get('/', (req, res) => {
    db.collection("books").count(function(err, count) {

        if(!err & count == 0) {
            seed()
            // console.log("No Found Records.");
            res.redirect('/');
        }
        else {
            Book.find({nextBook: "Yes"}, (err, book) => {
                        console.log(req.session)
                        next = book
                        console.log(next[0].title);
                    })
            Book.find({clubRead: "Yes"}, (err, book) => {
                        res.render('./clubs/homepage.ejs', {
                            bookIndex: book, 
                        });
                    })
        }
    })
    
})
   
    
   


//SUGGESTIONS PAGE
app.get('/suggestions', (req, res) => {
    Book.find({clubSuggest: "Yes"}, (err, book) => {
        res.render('./clubs/suggestions.ejs', {
            suggest: book, 
        });
    })
});

app.use("/books", booksController);
app.use("/users", usersController);
app.use("/clubs", clubsController);


app.listen(3000, () => {
    console.log("The app is running");
});