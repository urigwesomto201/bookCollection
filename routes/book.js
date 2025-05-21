const express = require("express");
const router = express.Router();
const upload = require("../helper/multer"); // multer
const {createBook,getAllBooks,getBookById,updateBook,deleteBook,getBooks} = require("../controllers/book");

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book collection management
 */


/**
 * @swagger
 * /books/createbook:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - ISBN
 *               - publicationDate
 *               - genre
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Atomic Habits"
 *               author:
 *                 type: string
 *                 example: "James Clear"
 *               ISBN:
 *                 type: string
 *                 example: "9780735211292"
 *               publicationDate:
 *                 type: string
 *                 format: date
 *                 example: "2018-10-16"
 *               genre:
 *                 type: string
 *                 example: "Self-help"
 *               coverImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Book created successfully"
 *               data:
 *                 _id: "6652e212bca21e6e48793c3e"
 *                 title: "Atomic Habits"
 *                 coverImages:
 *                   - imageUrl: "https://cloudinary.com/sample.jpg"
 *                     imageId: "book_img_1"
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             example:
 *               message: "Please provide all required fields"
 *       500:
 *         description: Internal server error
 */
router.post("/createbook", upload.array("coverImages", 5), createBook);
/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     security: []
 *     responses:
 *       200:
 *         description: A list of all books
 *         content:
 *           application/json:
 *             example:
 *               message: "Books retrieved successfully"
 *               data:
 *                 - _id: "6652e212bca21e6e48793c3e"
 *                   title: "Atomic Habits"
 *                   author: "James Clear"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 */
router.get("/", getAllBooks);
/**
 * @swagger
 * /books/getbook/{id}:
 *   get:
 *     summary: Get a specific book by ID
 *     tags: [Books]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book found
 *         content:
 *           application/json:
 *             example:
 *               message: "Book retrieved successfully"
 *               data:
 *                 _id: "6652e212bca21e6e48793c3e"
 *                 title: "Atomic Habits"
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Book not found"
 *       500:
 *         description: Internal server error
 */
router.get("/getbook/:id", getBookById);
/**
 * @swagger
 * /books/update/{id}:
 *   put:
 *     summary: Update a book by ID
 *     tags: [Books]
 *     security: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Title"
 *               author:
 *                 type: string
 *                 example: "Updated Author"
 *               ISBN:
 *                 type: string
 *                 example: "1234567890"
 *               genre:
 *                 type: string
 *                 example: "Updated Genre"
 *               publicationDate:
 *                 type: string
 *                 format: date
 *                 example: "2020-01-01"
 *               coverImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Book updated
 *         content:
 *           application/json:
 *             example:
 *               message: "Book updated successfully"
 *               data:
 *                 title: "Updated Title"
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Book not found"
 *       500:
 *         description: Internal server error
 */
router.put("/update/:id", upload.array("coverImages", 5), updateBook);
/**
 * @swagger
 * /books/delete/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Books]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Book deleted successfully"
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Book not found"
 *       500:
 *         description: Internal server error
 */
router.delete("/delete/:id", deleteBook);
/**
 * @swagger
 * /books/book:
 *   get:
 *     summary: Search and filter books
 *     tags: [Books]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         example: "Atomic"
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         example: "Clear"
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         example: "Self-help"
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, alphabetical]
 *         example: "newest"
 *     responses:
 *       200:
 *         description: Filtered book results
 *         content:
 *           application/json:
 *             example:
 *               message: "Books retrieved successfully"
 *               data:
 *                 - title: "Atomic Habits"
 *                   author: "James Clear"
 *       500:
 *         description: Internal server error
 */
router.get("/book", getBooks);

module.exports = router;