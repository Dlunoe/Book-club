const express = require('express');
const router = express.Router();
const User = require('../models/users');

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
        console.log(err);
        res.send(err);
    }  
})

//login post route
router.post("/login", async (req, res)=>{
    try{
        const userFromDb = await User.findOne({username:req.body.username})
        if(req.body.password!==userFromDb.password){
            console.log(req.body.password);
            console.log(req.params.password)
            res.send("Password is incorrect")
            res.redirect("/login")
        }else{
            req.session.userId=userFromDb._Id
            res.redirect("/books")
        }
    }catch(err){
        if(err="11000"){
            alert("Username is already taken");
        }
        console.log(err);
        res.send(err)
    }
    
})

module.exports = router;