//Seeds data.
const mongoose = require("mongoose");
const Kebab = require("../models/kebab");
const cities = require("./cities");
const names = require("./names");

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
const randomNb = (size) => {
  return Math.floor(Math.random() * size);
};

//Removes all data in database, then add in seeds data
const seedsdb = async () => {
  await Kebab.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const rand_city = randomNb(cities.length);
    const keb = new Kebab({
      name: `${names[randomNb(names.length)]}`,
      location: `${cities[rand_city].city}, ${cities[rand_city].admin_name}`,
      description:
        "Nulla ut reprehenderit nostrud duis excepteur voluptate cupidatat officia ut sit quis irure id. Commodo cillum do ut dolore. Quis nulla commodo pariatur ipsum pariatur labore nisi Lorem sint reprehenderit aliquip exercitation. Veniam velit id nisi officia culpa commodo dolor aute minim. Anim non qui dolore amet excepteur pariatur proident consequat velit. Aliqua ut tempor occaecat dolor nulla anim qui ex consequat aliquip enim. Ex sint sunt id incididunt dolor ipsum nisi est veniam nisi et est consectetur adipisicing. Fugiat pariatur cillum velit anim consectetur fugiat aute qui occaecat nulla. Eiusmod dolor aliqua et commodo commodo reprehenderit dolore esse est tempor cupidatat.",
      price: randomNb(50),
      image: "https://source.unsplash.com/1600x900/?kebab",
    });
    await keb.save();
  }
  console.log("Seeds data successfully inserted");
};

seedsdb();
