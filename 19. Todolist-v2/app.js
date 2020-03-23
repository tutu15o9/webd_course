//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", { useUnifiedTopology: true , useNewUrlParser: true });

const itemSchema = {
  name : String
};

const item = mongoose.model("item",itemSchema);
var work = [];
const item1 = new item({
  name : "Welcome to your todolist!"
});

const item2 = new item({
  name : "Hit the + button to add new item."
});

const item3 = new item({
  name : "<-- Hit this to delete an item."
});
const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("List",listSchema);

app.get("/", function(req, res) {

  const day = date.getDate();

  item.find({},function(err,results){
    if (err) {
      console.log(err);
    } else {
      if(results.length === 0){
        item.insertMany(defaultItems,function(err){
          if (err) {
        		console.log(err);
        	} else {
        		console.log("Default items inserted.");
        	}
        });
        res.redirect("/");
      }
      // console.log(results);
      results.forEach(function(elem){
        // console.log(elem.name);
        work.push(elem.name);
      });
      res.render("list", {listTitle: day, newListItems: work});
        // work.splice(0 ,A.length);
        work = [];
    }
  });

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  var newItem = new item({name:itemName});
  newItem.save(function(err){
    if (err) {
      console.log(err);
    } else {
      console.log("New item inserted Successfully");
    }
  });


  res.redirect("/");

});

app.post("/delete", function(req, res){
  var itemToDelete = req.body.checkbox;
  item.deleteMany({name: itemToDelete },function(err){
    if (err) {
      console.log(err);
    } else {
      console.log(itemToDelete + " has been deleted.");
    }
  });
  res.redirect("/");
});

app.get("/:customListName", function(req,res){
  const customListName = req.params.customListName;
  // console.log(customListName);
  List.findOne({name: customListName},function(err, foundList){
    if (err) {
      console.log(err);
    } else {

      if(!foundList){
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/"+customListName);
      } else{
        foundList.items.forEach(function(elem){
          // console.log(elem.name);
          work.push(elem.name);
        });

        res.render("list",{listTitle: customListName, newListItems:work });
        work = [];
      }

    }
  });



});


app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
