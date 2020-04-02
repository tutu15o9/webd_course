//jshint esversion:6
// require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
// const bcrypt = require("bcrypt");
// const saltRound = 10;

const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));


app.use(session({
	secret:"Our little secret",
	resave:false,
	saveUninitialized:true,

}));
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology:true});
// mongoose.connect("mongodb://localhost:27017/userDb",{useUnifiedTopology:true, useNewUrlParser:true});
mongoose.set("useCreateIndex",true);
const userSchema = new mongoose.Schema({
	email:String,
	password:String
});

// const secret = "Thisisourlittlesecrer.";
// userSchema.plugin(encrypt,{secret: process.env.SECRET,encryptedFieldscd :["password"]});
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User",userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",function(req,res){
	res.render("home");
});


app.get("/login",function(req,res){
	res.render("login");
});

app.post("/login",function(req,res){
	// const userName = req.body.username;
	// const password = req.body.password;
	//
	//
	// User.findOne({email:userName},function(err,founduser){
	// 	if (err) {
	// 		console.log(err);
	// 	} else {
	//
	// 		bcrypt.compare(password,founduser.password,(err,result)=>{
	// 			if(result === true){
	// 				res.render("secrets");
	// 			}
	// 		});
	//
	// 	}
	// });

	const user = new User({
		username: req.body.username,
		password:  req.body.password
	});

	req.login(user, (err)=>{
		if (err) {
			console.log(err);
			res.redirect("/login");
		} else {
			passport.authenticate("local")(req,res,()=>{
				res.redirect("/secrets");
			});
		}
	});

});
app.get("/logout",(req,res)=>{
	req.logout();
	res.redirect("/");
});

app.get("/register",function(req,res){
	res.render("register");
});
app.get("/secrets",(req ,res)=>{
	if(req.isAuthenticated()){
		res.render("secrets");
	}else{
		res.redirect("/login");
	}
});
app.post("/register",function(req,res){

	// bcrypt.hash(req.body.password, saltRound,(err,hash)=>{
	// 	const newUser = new User({
	// 		email:req.body.username,
	// 		password:hash
	// 	});

		// newUser.save(function(err){
		// 	if (err) {
		// 		console.log(err);
		// 	} else {
		// 		// console.log("ij");
		// 		res.render("secrets");
		// 	}
		// });

		User.register({username:req.body.username},req.body.password,(err, user)=>{
			if (err) {
				console.log(err);
				res.redirect("/register");
			} else {
				passport.authenticate("local")(req,res,()=>{
					res.redirect("/secrets");
				});
			}
		});
});




app.listen(3000,function(){
	console.log("Server started on port 3000.");
});
