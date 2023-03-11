//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const res = require("express/lib/response");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const url = "mongodb://127.0.0.1:27017/"
const dbName = "todolistDB"
// console.log(`${url}${dbName}`);

mongoose.connect(`${url}${dbName}`)

const itemSchema = {
  name:String
}

const Item = mongoose.model(
  "Items",
  itemSchema
)

const item1 = new Item({
  name:"welcome to your todolist"
})

const item2 = new Item({
  name:"hit + button to ad a new item"
})

const item3 = new Item({
  name:"<-- hit this to delete an item"
})

const defaultItems = [item1, item2, item3]


console.log("successfully saved default database");


app.get("/", async function (req, res) {
  const data = await Item.find({})

  if (data.length === 0) {
    Item.insertMany(defaultItems)
    res.redirect("/")
  } else {
    res.render("list", {
      listTitle: "Today",
      newListItems: data
    })
  }
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name:itemName
  })
  item.save()
  res.redirect("/")
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
