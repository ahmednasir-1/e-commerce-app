const Book = require('../models/Book');
const { deleteImage, uploadImage } = require('../config/cloudinary');


exports.list = async (req, res, next) => {
  try {
    const { search, category, author, page = 1, limit = 12 } = req.query;
    const q = {};
    if (search)
      q.$or = [{ title: new RegExp(search, 'i') }, { author: new RegExp(search, 'i') }];

    if (category)
      q.category = category;

    if (author)
      q.author = new RegExp(author, 'i');

    const skip = (Number(page) - 1) * Number(limit);

    const [books, total] = await Promise.all([
      Book.find(q).sort('-createdAt').skip(skip).limit(Number(limit)),
      Book.countDocuments(q),
    ]);

    res.json({ success: true, books, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (e) {
    next(e);
  }
};

// get speific book
exports.getOne = async (req, res, next) => {
  try {

    const book = await Book.findById(req.params.id);
    if (!book)
      return res.status(404).json({ success: false, message: 'Book not found' });

    res.json({ success: true, book });

  } catch (e) {
    next(e);
  }
};

// create a new book
exports.create = async (req, res) => {
  try {
    let imageUrl = '';

    // req.file.buffer comes from multer memoryStorage
    if (req.file) {
      const result = await uploadImage(req.file.buffer); // ← buffer, not path
      imageUrl = result.secure_url;
    }

    const book = await Book.create({ ...req.body, image: imageUrl });

    res.status(201).json({ success: true, book });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// update a book
exports.update = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });

    let imageUrl = book.image; // keep old image by default

    if (req.file) {
      if (book.image) await deleteImage(book.image); // delete old from Cloudinary
      const result = await uploadImage(req.file.buffer); // ← buffer, not path
      imageUrl = result.secure_url;
    }

    const updated = await Book.findByIdAndUpdate(
      req.params.id,
      { ...req.body, image: imageUrl },
      { new: true }
    );

    res.json({ success: true, book: updated });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// remove a book
exports.remove = async (req, res, next) => {
  try {

    await Book.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Deleted' });

  } catch (e) {
    next(e);
  }
};
