const express = require("express");
const bodyParser = require("body-parser");
var request = require("request");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));


app.listen(3000,function () {
  console.log("Server running on port 3000");
});

app.post("/",function(req,res){
  var crypto = req.body.crypto;
  var fiat = req.body.fiat;
  var amt = req.body.amount;

  var option = {
    url: "https://apiv2.bitcoinaverage.com/convert/global",
    method: "GET",
    qs: {
      from: crypto,
      to: fiat,
      amount: amt
    }
  }
  request(option , function (error,responce,body) {
    var data = JSON.parse(body);
    var price = data.price;
    var currentDate = data.time;
    res.write("<p>The current Date is " + currentDate + "</p>");
    res.write("<h1>" + amt + crypto + "is " + price + fiat +"</h1>");
    res.send();
  });
});
app.get("/",function(req,res) {
  res.sendFile(__dirname + "/index.html");
});
