// jshint esversion:6

const express =require("express");

const app = express();

app.listen(3000,function(){
  console.log("Server hosted on port 3000");
});
app.get("/",function(req, res){
  // console.log(request);
  res.send("Hello");
});
app.get("/contact",function(req, res){
  // console.log(request);
  res.send("Contact me at r@gmail.com");
});

app.get("/hobies",function(req, res){
  // console.log(request);
  res.send("shooting.");
});
