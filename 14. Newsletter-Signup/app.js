const express = require("express");
const bodyParser = require("body-parser");
var request = require("request");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.listen(process.env.PORT || 3000,function () {
  console.log("Server running on port 3000");
});

app.get("/",function(req,res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/" , function(req,res) {
  var firstName = req.body.fname;
  var lastName = req.body.lname;
  var email = req.body.email;
  var data = {
    members : [
      {
        email_address: email,
        status:"subscribed",
        merge_fields :{
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  var jsonData = JSON.stringify(data);

  var options = {
    host :'https://us4.api.mailchimp.com/3.0',
    url : 'https://us4.api.mailchimp.com/3.0/lists/5ec9e92d83',
    method: 'POST',
    headers: {
    // 'Authorization' : 'rahul 31db3e9d80c629631946dc829c286a61-us4'
    },
    body:jsonData
  }
  request(options, function(error, responce, body) {
    if (error){
      res.sendFile(__dirname+"/failure.html");
    } else {
      if (responce.statusCode === 200){
        res.sendFile(__dirname+"/success.html");
      } else {
        res.sendFile(__dirname+"/failure.html")
      }
    }
  });
  // console.log(firstName,lastName,email);
});

app.post("/failure",function(req,res){
  res.redirect("/");
});
// Api key
// 31db3e9d80c629631946dc829c286a61-us4
// List id
// 5ec9e92d83
