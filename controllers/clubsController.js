const express = require('express');
const router = express.Router();
const Club = require ('../models/clubs');


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


//INDEX ROUTE
router.get('/', (req, res) => {
    Club.find({}, (err, clubs) => {
        res.render('./clubs/index.ejs', {
            clubIndex: clubs
        });
    })
})

module.exports = router;