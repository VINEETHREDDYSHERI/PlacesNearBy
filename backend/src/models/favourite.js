const mongoose = require("mongoose");

const userFavouriteSchema = new mongoose.Schema({
  emailAddress: {
    type: String,
    required: true,
    unique: true,
  },
  favourites: [
    {
      type: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserFavourite = new mongoose.model("Favourite", userFavouriteSchema);

module.exports = UserFavourite;
