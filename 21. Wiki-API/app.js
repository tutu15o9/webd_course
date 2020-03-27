const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useUnifiedTopology:true, useNewUrlParser:true});
const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article",articleSchema);

//////////////////////////////////////////////////////////////////////////////////////////////////
app.route("/articles")
	.get(function(req,res){
		Article.find(function(err,articles){
			if (err) {
				res.send(err);

			} else {
				// console.log(articles);
				res.send(articles);
			}
		});
	})
	.post(function(req,res){
		let articleTitle = req.body.title;
		let articleContent = req.body.content;
		const newArticle = new Article({
			title :articleTitle,
			content:articleContent
		});
		newArticle.save(function(err){
			if(err){
				res.send(err);
			}else{
				res.send("Successfully added the article");
			}
		});
	})
	.delete(function(req,res){
		Article.deleteMany({},function(err){
			if (err) {
				res.send(err);
			} else {
				res.send("Successfully deleted");
			}
		});
	});
///////////////////////////////////////////////////////////////////////////////////////////////////////////

app.route("/articles/:name")
	.get(function(req,res){
		const articleTitle = req.params.name;
		Article.findOne({title:articleTitle},function(err,articles){
			if (err) {
				res.send(err);

			} else {
				// console.log(articles);
				res.send(articles);
			}
		})
	})
	.put(function(req,res){
		const articleTitle1 = req.body.title;
		const articleContent = req.body.content;
		const articleTitle = req.params.name;
		Article.update(
			{title:articleTitle},
			{	title :articleTitle1,
				content:articleContent},
			{overwrite:true},
			function(err){
				if (err) {
					res.send(err);
				} else {
					res.send("Successfully Updated");
				}
			}
		);
	})
	.patch(function(req,res){
		const articleTitle = req.params.name;

		Article.update(
		{title:articleTitle},
		{$set: req.body},
		function(err){
			if (err) {
				res.send(err);

			} else {
				res.send("Successfully Updated");
				
			}
		}
		);


	})

	.delete(function(req,res){
		const articleTitle = req.params.name;

		Article.deleteMany({title:articleTitle},function(err){
			if (err) {
				res.send(err);
			} else {
				res.send("Successfully deleted");
			}
		});
	});

app.listen(3000, function(){
	console.log("Server started on port 3000. ");
});
