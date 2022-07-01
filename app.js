const express = require("express");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {

  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  var firstName = req.body.fname;
  var lastName = req.body.lname;
  var email = req.body.email;

  var data = {
    members: [{
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }

      }


    ]
  };

  // we send this to mailchimp
  const jsonData = JSON.stringify(data);

  const url = "https://us20.api.mailchimp.com/3.0/lists/db60ad3e5c";

  const options = {
    method: "POST",
    auth: "RijuTejas:eb835fea4c8bc5d101ad4d6383c2431b-us20"
  }

  const request = https.request(url, options, function(response) {
    if(response.statusCode==200){
      res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });

  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req,res){
  res.redirect("/");
});

app.listen( process.env.PORT || 3000 , function() {
  console.log("Server is running on port 3000");
});

//API KEY
//eb835fea4c8bc5d101ad4d6383c2431b-us20

//List Id
//db60ad3e5c
