const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  ISBN: String,
  publicationDate: Date,
  genre: String,
  coverImages: [
    {
    imageUrl: String,
    imageId: String,
  }
]
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);