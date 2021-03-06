const express = require('express');
const router = express.Router();
const Club = require ('../models/clubs');
const Book = require ('../models/books');




// SEED ROUTE
// Can be used to send some intial data for testing.
router.get('/seed',(req, res)=>{
    Club.create([
        {
            clubName: 'Ladies Who Lunch'
        },
        {
            clubName: 'Book Wizards'
        },
    ], (err, data)=>{
        res.redirect('/clubs');
    })
});


module.exports = router;

//INDEX ROUTE
router.get('/', (req, res) => {
    Club.find({}, (err, clubs) => {
        res.render('./clubs/index.ejs', {
            clubIndex: clubs
        });
    })
    Book.find({}, (err, books) => {
        
    })
})

module.exports = router;