//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://ADMIN:ADMIN@cluster0.n2eue.mongodb.net/secretsDB",{useNewUrlParser:true,useUnifiedTopology: true});

const app = express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));

const userSchema = new mongoose.Schema({
	email: String,
	password: String
});
userSchema.plugin(encrypt,{secret: process.env.ENCRYPTPASSWORD,encryptedFields:["password"] });
const User = mongoose.model("users",userSchema);

app.get("/",function(req,res){
	res.render("home");
})

app.get("/login",function(req,res){
	res.render("login");
})

app.get("/register",function(req,res){
	res.render("register");
})

app.post("/register",function(req,res){
	const newUser = new User({
		email: req.body.username,
		password: req.body.password
	})
	newUser.save(function(err){
		if(!err){
			res.render("secrets");
		}
		else{
			res.send(err);
		}
	});
})

app.post("/login",function(req,res){
	User.findOne({email: req.body.username},function(err,data){	
		if(data){
			if(data.password === req.body.password){
			res.render("secrets");
			}
			else{
			res.send("sorry wrong password");
			}
		}

		else{
			res.send("sorry not registered with this mail");
		}
	})
})











app.listen("3000",function() {
	console.log("server starts !");
})
