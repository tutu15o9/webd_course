//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const app = express();
const _ = require("lodash");
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
const day = date.getDate();
app.get('/favicon.ico', (req, res) => res.status(204));
app.get("/", function(req, res) {



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
  const listName = req.body.list;


  var newItem = new item({name:itemName});

  if(listName === day){
    newItem.save(function(err){
      if (err) {
        console.log(err);
      } else {
        console.log("New item inserted Successfully");
      }
    });


    res.redirect("/");
  } else{
    List.findOne({name:listName},function(err, foundList){
      foundList.items.push(newItem);
      foundList.save(function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("New item inserted Successfully");
        }
      });
    });
    res.redirect("/"+listName);
  }

});

app.post("/delete", function(req, res){
  var itemToDelete = req.body.checkbox;
  var listName = req.body.listName;
  if (listName == day) {
    item.deleteMany({name: itemToDelete },function(err){
      if (err) {
        console.log(err);
      } else {
        console.log(itemToDelete + " has been deleted.");
        res.redirect("/");
      }
    });

  } else {
    List.findOneAndUpdate({name: listName},{$pull: {items: {name:itemToDelete}}},function(err){
      if (err) {
        console.log(err);
      } else {
        console.log(itemToDelete + " has been deleted.");
        res.redirect("/" + listName);
      }
    });
  }

});

app.get("/:customListName", function(req,res){
  const customListName = _.capitalize(req.params.customListName);
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
