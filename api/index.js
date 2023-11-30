const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const users = require('./models/users');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require ('multer');
const fs = require('fs');
const Post = require('./models/Post');
const { match } = require('assert');

const uploadMiddleWare = multer({ dest: 'uploads/'});

const salt = bcrypt.genSaltSync(10);

const secret = 'adfeeegssfs3435bfh5hh5';

app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads')); 
mongoose.connect('mongodb+srv://blog:RCW1E1WU8sIp8bl1@cluster0.rxbcbcl.mongodb.net/?retryWrites=true&w=majority')

app.post('/register', async (req,res) => {
    const {UserName, PassWord} = req.body;
    try{
        const userDoc = await users.create({UserName, PassWord:bcrypt.hashSync(PassWord,salt),});
    res.json(userDoc);
    }
    catch(e){
        
        res.status(400).json(e);
    }
    


});

app.post('/login', async (req,res) => {
    const{UserName, PassWord} = req.body;
    const userDoc = await users.findOne({UserName}); 
    const passOk = bcrypt.compareSync(PassWord, userDoc.PassWord);
    if (passOk){
        //logged in
        jwt.sign({UserName, id:userDoc._id}, secret, {}, (err, token) =>{
            if (err) throw err;
            res.cookie('token', token).json({
                id:userDoc._id,
                UserName,
            });
        });
    }
    else{
        res.status(400).json('Wrong Credentials');
    }
    
});

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) =>{
        if (err) throw err;
        res.json(info);
    });
    

});



app.post('/logout', (req, res) => {
    res.cookie('token','').json('ok');

});



/*app.post('/logout', (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: 'Jwt must be provided' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Failed to authenticate token' });
            }

            res.clearCookie('token');
            res.json('ok');
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});*/

app.post('/post', uploadMiddleWare.single('file'), async (req, res) => {
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length -1];
    const newPath = path +'.'+ext;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) =>{
        
        if (err) throw err;
        const {title,summary,content} = req.body;
        const PostDoc = await Post.create({
            title,
            summary,
            content,
            cover:newPath,
            author:info.id, 
        });
        res.json(PostDoc);
        

    });
   
    });

app.get('/post', async (req,res) => {
    
    res.json(await Post.find()
    .populate('author', ['UserName'])
    .sort({createdAt: -1})
    .limit(10)
    );

});

app.get('/post/:id', async (req, res) =>{
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['UserName']);
    res.json(postDoc);
})

app.put('/post', uploadMiddleWare.single('file'), async (req, res) => {
    let newPath = null;
    if(req.file){
        
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length -1];
        newPath = path +'.'+ext;
        fs.renameSync(path, newPath);  
    }

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) =>{
        
        if (err) throw err;
        const {id,title,summary,content} = req.body;
        const  postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if(!isAuthor){
            return res.status(400).json('Invalid Author');
        }
        
        await postDoc.updateOne({
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,
        });
        res.json(postDoc);
        
        
    });
});


app.listen(4000);

//mongodb+srv://blog:<RCW1E1WU8sIp8bl1>@cluster0.rxbcbcl.mongodb.net/?retryWrites=true&w=majority
