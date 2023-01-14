const express=require("express");
const mongoose=require("mongoose");
const jwt=require("jwt-simple");
const bcrypt=require('bcrypt-nodejs')

const User=require("../models/User");
const router=express.Router();



router.route('/register').post((req,res)=>{
    var userData=req.body;
    console.log(userData);
    var user=new User(userData);
    
    user.save((err,result)=>{
        if(err){
            console.log(err);
        }
    })
    res.sendStatus(200);
})

router.route('/login').post( async (req,res)=>{
    var loginData=req.body;
    console.log(loginData);
    try{
    var user= await User.findOne({email:loginData.email},'-__v');
    }catch(error){
        console.error(error);
    }
    

    if(!user){
        return res.status(401).send({message:"Email is invalid"});
    }

    
    bcrypt.compare(loginData.password,user.password,(err,isMatch)=>{
    if(!isMatch){
        return res.status(401).send({message:"Email or Password is invalid"});
    }
    var payload={sub:user._id}

    var token=jwt.encode(payload,'123');

    res.status(200).send({token})
}
    )

    

    
})


var authRouter={
    router,
    
    checkAuthenticated:(req,res,next)=>{
        if(!req.header('authorization'))
            return res.status(401).send({message:"Unauthorized, Missing Header"});
        
        var token=req.header('authorization').split(' ')[1]
        console.log(token);
        var payload = jwt.decode(token, '123');
    
        if(!payload)
            return res.status(401).send({message:"Unauthorized, Header Invalid"});
    
        req.userId= payload.sub
    
        next();
    }
    
}

module.exports=authRouter;
