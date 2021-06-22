//Seeds data.
const mongoose = require("mongoose");
const Kebab = require("../models/kebab");
const cities = require("./cities")
const names = require("./names")

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


//Returns a random number < size
const randomNb = (size) =>{
    return Math.floor(Math.random()*(size))
}

//Removes all data in database, then add in seeds data
const seedsdb = async() =>{
    await Kebab.deleteMany({});
    for (let i = 0; i<50 ; i++){
        const rand_city = randomNb(cities.length);
        const keb = new Kebab({
            name: `${names[randomNb(names.length)]}`,
            location: `${cities[rand_city].city}, ${cities[rand_city].admin_name}`,
        })
        await keb.save()
    }
    console.log("Seeds data successfully inserted")
}

seedsdb()