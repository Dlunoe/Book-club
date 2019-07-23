const express = require('express');
const router = express.Router();
const User = require('../models/users');

//new page
router.get('/new', (req, res)=>{
    res.send("./users/new.ejs")
})

//login page
router.get("/login", (req, res)=>{
    res.send('./users/login.ejs')
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
        function passwordIsValid(){
        if(req.body.password!==req.params.password){
            res.send("Password is incorrect")
            res.redirect("/login")
        }else{
            req.session.userId = newUser._Id;
            res.redirect("/books")
        }
    }
    }catch(err){
        console.log(err);
        res.send(err)
    }
    
})

module.exports = router;