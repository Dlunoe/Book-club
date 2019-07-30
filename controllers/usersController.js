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
        req.session.user=newUser
        res.redirect("/")
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
        console.log(userAtHome)
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
            res.redirect("/")
        } 
    }catch(err){
        console.log(err);
        res.send(err)
    }
    
})

//move book to finished list
router.put('/dashboard/:id/finishedList', async (req,res)=>{
    // console.log(req.params)
    const finishedBook = await Book.findById(req.params.id).populate('creator')
    console.log(req.body)
        User.findByIdAndUpdate({_id:req.session.user._id},
            {$push: {finishedList: finishedBook
            }
        },
            {new:true},
            (error, user)=>{
                if (error){console.log(error)}
                else{
                    console.log("-------")
                    console.log(req.session.user)
                    res.redirect("/users/dashboard")}
                }
            )
    })

//remove book from reading list
router.delete('/dashboard/:id', async (req, res) => {
    console.log(req.params.id)
    const foundBook = await Book.findById(req.params.id).populate('creator')
    console.log(foundBook)
    User.findOneAndUpdate({_id:req.session.user._id}
        ,{$pull:{readingList:foundBook}},
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