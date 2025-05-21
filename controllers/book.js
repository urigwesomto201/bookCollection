const Book = require("../models/book.model");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");


exports.createBook = async (req, res) => {
  try {
    const { title, author, ISBN, publicationDate, genre } = req.body;

    // Make sure files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No image files uploaded" });
    }

    const files = req.files;
    const coverImages = [];

    // Upload each file to Cloudinary and delete from local
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path);
      
      // Push Cloudinary response into coverImages array
      coverImages.push({
        imageUrl: result.secure_url,
        imageId: result.public_id,
      });

      // Delete file from local uploads folder
      fs.unlinkSync(file.path);
    }

    // Save book in DB
    const book = await Book.create({
      title,
      author,
      ISBN,
      publicationDate,
      genre,
      coverImages, // save the array
    });

    res.status(201).json({
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
}+ error.message);
}
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Books fetched successfully", data: books });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" }+ error.message);
  }
};

exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    res.status(200).json({ message: "Book fetched successfully", data: book });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" }+ error.message);
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, ISBN, publicationDate, genre } = req.body;

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Delete old images from Cloudinary
    for (const img of book.coverImages) {
      await cloudinary.uploader.destroy(img.imageId);
    }

    // Upload new images
    const newCoverImages = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path);
      fs.unlinkSync(file.path);
      newCoverImages.push({ imageUrl: result.secure_url, imageId: result.public_id });
    }

    // Update book fields
    book.title = title || book.title;
    book.author = author || book.author;
    book.ISBN = ISBN || book.ISBN;
    book.publicationDate = publicationDate || book.publicationDate;
    book.genre = genre || book.genre;
    book.coverImages = newCoverImages;

    await book.save();
    res.status(200).json({ message: "Book updated successfully", data: book });

  } catch (error) {
    res.status(500).json({ message: "Internal server error" }+ error.message);
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    for (const img of book.coverImages) {
      await cloudinary.uploader.destroy(img.imageId);
    }

    await book.deleteOne();
    res.status(200).json({ message: "Book deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Internal server error" }+ error.message);
  }
};


exports.getBooks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, genre, sortBy = 'createdAt', order = 'desc' } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    if (genre) {
      query.genre = genre;
    }

    const books = await Book.find(query)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" }+ error.message);
  }
};