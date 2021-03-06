const express = require('express');
const router = express.Router();
const Book = require ('../models/books');
const User = require('../models/users')
const requireLogin = require('../middleware/requireLogin')

// SEED ROUTE
// Can be used to send some intial data for testing.
router.get('/seed',(req, res)=>{
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
        res.redirect('/clubs/homepage');
    })
});



//INDEX ROUTE
router.get('/', async (req, res) => {
    try{
        
        req.body.creator = req.session.userId;
        const books = await Book.find().populate('creator')
        res.render('index.ejs', {
            bookIndex: books
        });
    }catch(err){
        res.send(err)
    }
})

//NEW ROUTE
router.get('/new', requireLogin, (req, res) => {
    res.render('new.ejs');
    console.log(Book);
})

//CREATE ROUTE
router.post('/', (req, res) => {
    if(!req.session.userId){
        req.session.message = "You must be logged in to do that"
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
            creator: req.session.userId   
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
        // console.log(bookShow)
        // console.log(bookShow)
    }catch(err){
        res.send(err)
    }  
});

//EDIT ROUTE
router.get('/:id/edit', requireLogin, (req, res) => {
    Book.findById(req.params.id, (err, foundBook) => {
        res.render('edit.ejs', {
            bookUpdate: foundBook
        });
    });
});
//reading list
router.put('/:id/readingList', async (req,res)=>{
    const foundBook = await Book.findById(req.params.id)
    // console.log(foundBook)
    // console.log(req.session.user)
    User.findByIdAndUpdate({_id:req.session.user._id},
            {$push: {
                readingList:foundBook
            }
        },
            // {new:true},
            (error, user)=>{
                if (error){console.log(error)}
                else{                     
                    console.log("-------")
                    console.log(req.session.user)
                    }
                }
            )            
            res.redirect("/users/dashboard")      
    })



//UPDATE ROUTE
router.put('/:id', async (req, res) => {
    const book = await Book.findById(req.params.id)
    if(book.creator.toString() !== req.session.userId){
        req.session.message = "Unauthorized, you didn't upload this book."
        res.redirect("/books")
    }else{
    Book.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedBook) => {
        res.redirect('/books')
    });
}
});

//DESTROY ROUTE
router.delete('/:id', async (req, res) => {
    const book = await Book.findById(req.params.id)
    if(book.creator.toString() !== req.session.userId){
        req.session.message = "Unauthorized, you didn't upload this book"
        res.redirect('/books')
    }else{
    Book.findByIdAndRemove(req.params.id, (err, bookRemove) => {
        res.redirect('/books');
    });
}
});

module.exports = router;