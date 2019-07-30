const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Book = require('../models/books')

//new page
router.get('/new', (req, res)=>{
    res.render("./users/new.ejs")
})

//login page
router.get("/login", (req, res)=>{
    res.render('./users/login.ejs')
})

//New user post route
router.post("/", async (req, res)=>{
    try{
        const newUser = await User.create(req.body);
        req.session.userId = newUser._Id;
        res.redirect("/books")
    }catch(err){
        if(err="11000"){
            res.send("Username is already taken");
        }else{
            req.session.message="invalid credentials";
            console.log(err);
        }       
    }  
})


router.get("/dashboard", async (req, res)=>{
    try{
        const userAtHome = req.session.user
        // console.log(req.session.user)
        res.render('users/show.ejs', {
            userOnPage : userAtHome
        })
        
    }catch(err){
        console.log(err);
        res.send(err)
    }
    
})

//login post route
router.post("/login", async (req, res)=>{
    try{
        const userFromDb = await User.findOne({username:req.body.username})
        if(req.body.password!==userFromDb.password){
            // console.log(req.body.password);
            // console.log("========");
            //console.log(userFromDb)
            res.redirect("/users/login")
        }else{
            // console.log(userFromDb)
            req.session.userId=userFromDb._id
            req.session.user=userFromDb
            console.log(req.session.user)
            res.redirect("/books")
        } 
    }catch(err){
        console.log(err);
        res.send(err)
    }
    
})

//move book to finished list


//remove book from reading list
router.delete('/dashboard/:id', async (req, res) => {
    User.findOneAndUpdate({_id:req.session.user._id}
        ,{$pull:{readingList:{_id:req.params.id}}},
        {new:true},
        (error, user)=>{
            if(error){
                res.send(error)
            }else{

                console.log("-------")
                    console.log(req.session.user)
                    res.redirect("/users/dashboard")}
            }
    )
});

router.get('/logout', function(req, res) {
    req.session.destroy()
    res.redirect('/books');
});

module.exports = router;