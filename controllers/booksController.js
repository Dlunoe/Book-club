const express = require('express');
const router = express.Router();
const Book = require ('../models/books');

//INDEX ROUTE
router.get('/', async (req, res) => {
    try{
        req.body.creator = req.session.userId;
        const books = await Book.find()
        res.render('index.ejs', {
            bookIndex: books
        });
    }catch(err){
        res.send(err)
    }
})

//NEW ROUTE
router.get('/new', (req, res) => {
    res.render('new.ejs');
    console.log(Book);
})

//CREATE ROUTE
router.post('/', (req, res) => {
    if(!req.session.userId){
        res.redirect("/users/login")
    }else{
        Book.create({
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            creator:req.session.userId   
    });
    res.redirect("/books")
    }
  
})

//SHOW ROUTE
router.get('/:id', async (req, res) => {
    try{
        const foundBook = await Book.findById(req.params.id).populate('creator');
        res.render('show.ejs', {
            bookShow: foundBook
        });
        console.log("-------------------")
        console.log(creator)
    }catch(err){
        res.send(err)
    }  
});

//EDIT ROUTE
router.get('/:id/edit', (req, res) => {
    Book.findById(req.params.id, (err, foundBook) => {
        res.render('edit.ejs', {
            bookUpdate: foundBook
        });
    });
});

//UPDATE ROUTE
router.put('/:id', (req, res) => {
    console.log(req.body);
    Book.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedBook) => {
        res.redirect('/books')
    });
});

//DESTROY ROUTE
router.delete('/:id', (req, res) => {
    Book.findByIdAndRemove(req.params.id, (err, bookRemove) => {
        res.redirect('/books');
    });
});

module.exports = router;