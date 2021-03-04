const express = require("express");
const app = express();

app.use(express.static("public"))

app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html")
})

app.get("/grogu",function(req,res){
  res.send("grogu")
})

app.listen(3000, function(){
  console.log("listening on 3000");
})
