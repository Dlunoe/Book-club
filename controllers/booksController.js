const express = require('express');
const router = express.Router();
const Book = require ('../models/books');
const User = require('../models/users')

// SEED ROUTE
// Can be used to send some intial data for testing.
router.get('/seed',(req, res)=>{
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
            cover: req.body.cover,
            nextBook: req.body.nextBook,
            clubRead: req.body.clubRead,
            clubSuggest: req.body.clubSuggest,
            creator:req.session.userId   
    });
    res.redirect("/books")
    }
  
})

//SHOW ROUTE
router.get('/:id', async (req, res) => {
    try{
        const foundBook = await Book.findById(req.params.id).populate('creator');
        // console.log(foundBook);
        res.render('show.ejs', {
            bookShow: foundBook         
        });
        console.log("-------------------")
        console.log(bookShow)
        // console.log(bookShow)
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
//reading list
router.put('/:id/readingList', async (req,res)=>{
    const foundBook = await Book.findById(req.params.id).populate('creator')
        User.findByIdAndUpdate({_id:req.session.user._id},
            {$push: {readingList: {
                title:foundBook.title,
                author:foundBook.author,
                genre:foundBook.genre
                }
            }
        },
            {new:true},
            (error, user)=>{
                if (error){console.log(error)}
                else{
                    console.log("-------")
                    console.log(req.session.user)
                    res.redirect("/users/home")}
                }
            )
    })

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