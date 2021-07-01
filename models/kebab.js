const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const kebabSchema = new Schema({
  name: String,
  description: String,
  location: String,
  price: Number,
  image: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

kebabSchema.post("findOneAndDelete", async function (data) {
  //if data exist
  if (data) {
    await Review.deleteMany({
      _id: {
        //Remove all reviews of which their id corresponds to
        //those in kebab.reviews
        $in: data.reviews,
      },
    });
  }
});
module.exports = mongoose.model("Kebab", kebabSchema);
