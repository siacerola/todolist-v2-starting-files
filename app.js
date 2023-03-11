//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const res = require("express/lib/response");
const { redirect } = require("express/lib/response");

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

const listSchema = {
  name: String,
  items: [itemSchema]
}

const List = mongoose.model(
  "List",
  listSchema
)

app.get("/", async function (req, res) {
  const data = await Item.find({})

  if (data.length === 0) {
    Item.insertMany(defaultItems)
    
  console.log("successfully saved default database");
    res.redirect("/")
  } else {
    res.render("list", {
      listTitle: "Today",
      newListItems: data
    })
  }
});

app.get("/:customListName", async (req, res) => {
  const customListName = req.params.customListName
  console.log(customListName);


  const list = new List({
    name: customListName,
    items: defaultItems
  })
  console.log(mongoose.connection.readyState)
  console.log(list);

  
  // console.log(`${list.save()} is saved`);
  // console.log(`${list.save()} is saved tod atabasae list`);
})

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name:itemName
  })
  item.save()
  res.redirect("/")
});

app.post("/delete", async (req, res) => {
  const checkedItemId = req.body.checkbox
  const deleteItem = await Item.findByIdAndRemove(checkedItemId)
  console.log(`${deleteItem.name} is deleted`);
  res.redirect("/")
})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
