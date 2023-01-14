const mongoose=require("mongoose");
const bcrypt=require('bcrypt-nodejs');

var userSchema=new mongoose.Schema({
        email:String,
        password:String,
        name:String,
        bio:String
})

userSchema.pre('save',function(next){
    var user=this

    if(!user.isModified('password'))
        return next()

    bcrypt.hash(user.password,null,null,(err,hash)=>{
        
        user.password=hash;
        next();
    })
})

module.exports=mongoose.model("User",userSchema);