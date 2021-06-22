const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Kebab = require("./models/kebab");
const methodOverride = require("method-override")

//Database
mongoose.connect("mongodb://localhost:27017/kebab-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection failed"));
db.once("open", () => {
  console.log("Kebab database connected");
});

//The app
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/kebabs", async (req,res)=>{
  const allKebabs = await Kebab.find({});
  res.render("kebabs/index", {allKebabs})
})

app.get("/kebabs/new", (req,res)=>{
  res.render("kebabs/new")
})

app.get("/kebabs/:id", async (req,res) =>{
  const {id} = req.params;
  const kebab = await Kebab.findById(id)
  res.render("kebabs/show", {kebab})  
})


app.post("/kebabs", async(req,res)=>{
  const newKebab = await new Kebab(req.body.kebab)
  newKebab.save()
  res.redirect("/kebabs")
})

app.get("/kebabs/:id/edit", async (req,res)=>{
  const {id} = req.params
  const kebab = await Kebab.findById(id)
  res.render("kebabs/edit", {kebab})
})

app.put("/kebabs/:id", async (req,res) =>{
  const {id} = req.params
  const updatedKebab = await Kebab.findByIdAndUpdate(id, {...req.body.kebab})
  res.redirect(`/kebabs/${updatedKebab._id}`)
})

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
