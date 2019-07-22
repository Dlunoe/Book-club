const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const mongoose = require('mongoose');
const Book = require('./models/books');

const mongoURI = 'mongodb://localhost:27017/'+'books';
const db = mongoose.connection;

mongoose.connect(mongoURI, { useNewUrlParser: true }, () => {
    console.log('the mongo connection is established');
})


//MIDDLEWEAR
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(express.static('public'));


//SEED ROUTE
//Can be used to send some intial data for testing.
app.get('/books/seed', (req, res)=>{
    Book.create([
        {
            title: 'The Alice Network',
            author: 'Alice Quinn',
            genre: 'Historical Fiction'
        },
        {
            title: 'Where the Crawdads Sing',
            author: 'Delia Owens',
            genre: 'Fiction'
        },
        {
            title: 'The Silent Patient',
            author: 'Alex Michaelides',
            genre: 'Thriller'
        }
    ], (err, data)=>{
        res.redirect('/books');
    })
});


//INDEX ROUTE
app.get('/books', (req, res) => {
    Book.find({}, (err, books) => {
        res.render('index.ejs', {
            bookIndex: books
        });
    })
})

//NEW ROUTE
app.get('/books/new', (req, res) => {
    res.render('new.ejs');
    console.log(Book);
})

//CREATE ROUTE
app.post('/books', (req, res) => {
    console.log(req.body);
    Book.create(req.body, (err, newBook) => {
        res.redirect('/books');        
    });
})

//SHOW ROUTE
app.get('/books/:id', (req, res) => {
    Book.findById(req.params.id, (err, foundBook) => {
        res.render('show.ejs', {
            bookShow: foundBook
        });
    });
});

//EDIT ROUTE
app.get('/books/:id/edit', (req, res) => {
    Book.findById(req.params.id, (err, foundBook) => {
        res.render('edit.ejs', {
            bookUpdate: foundBook
        });
    });
});

//UPDATE ROUTE
app.put('/books/:id', (req, res) => {
    console.log(req.body);
    Book.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedBook) => {
        res.redirect('/books')
    });
});

//DESTROY ROUTE
app.delete('/books/:id', (req, res) => {
    Book.findByIdAndRemove(req.params.id, (err, bookRemove) => {
        res.redirect('/books');
    });
});

app.listen(3000, () => {
    console.log("The app is running");
});