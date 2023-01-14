const express=require("express");
const cors=require("cors");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const User=require("./models/User");
const jwt=require("jwt-simple");

const app=express();

const authRouter=require('./routes/auth');

const Post=require("./models/Post");
const { checkAuthenticated } = require("./routes/auth");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());


//retriving starts from here
mongoose.connect("mongodb://127.0.0.1:27017/users").then(()=>{
    console.log("Connected to db")
}).catch((error)=>{
    console.log("Error:",error)
}) 


app.get('/users', async (req,res)=>{
    let users=await User.find({});
    res.send(users); 
})

app.get('/feed', async (req,res)=>{
    let posts=await Post.find({});
    console.log(posts);
    res.send(posts)
})


app.get('/profile/:id', async(req,res)=>{
    try{
    let user=await User.findById(req.params.id,'-password -__v')
    res.send(user);
    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
})

app.get('/post/:id', async(req,res)=>{
    try{
    let post=await Post.find({"author":req.params.id},'-password -__v')
    res.send(post);
    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
})

app.post('/post',authRouter.checkAuthenticated,(req,res)=>{
    var postData=req.body;
    postData.author=req.userId;
    console.log(postData);
    var post=new Post(postData);
    
    post.save((err,result)=>{
        if(err){
            console.log(err);
        }
        console.log(result)
    })
    res.sendStatus(200);
})



app.use('/auth',authRouter.router);

app.listen(3000,()=>{
    console.log("Listening on port 3000");
})