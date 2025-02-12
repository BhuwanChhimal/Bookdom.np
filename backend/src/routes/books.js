const express = require('express');
const router = express.Router();
const Books = require('../models/Books');

const cloudinary = require('../lib/cloudinary');
const upload = require('../lib/upload');
const { Readable } = require('stream');

// Helper function to upload to Cloudinary
const uploadToCloudinary = async (buffer) => {
    return new Promise((resolve, reject) => {
        const writeStream = cloudinary.uploader.upload_stream(
            {
                folder: 'bookdom',
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        
        const readStream = Readable.from(buffer);
        readStream.pipe(writeStream);
    });
};


/**
 * Get all books
 * @route GET /api/books
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const books = await Books.find().select('-__v');
    res.status(200).json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * Create a new book with image
 * @route POST /api/books
 * @access Private
 */
router.post('/', upload.single('image'), async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ success: false, error: 'Please upload an image' });
      }

      // Upload image to Cloudinary
      const result = await uploadToCloudinary(req.file.buffer);

      // Create new book with image URL
      const book = await Books.create({
          ...req.body,
          imageUrl: result.secure_url,
          imagePublicId: result.public_id
      });

      res.status(201).json({ success: true, data: book });
  } catch (error) {
      console.error('Error creating book:', error);
      res.status(500).json({ success: false, error: 'Error creating book' });
  }
});

// Add this new route for random book
router.get('/random', async (req, res) => {
  try {
    const books = await Books.find();
    if (!books.length) {
      return res.status(404).json({ message: 'No books found' });
    }
    
    // Get a random index
    const randomIndex = Math.floor(Math.random() * books.length);
    const randomBook = books[randomIndex];
    
    res.json(randomBook);
  } catch (error) {
    console.error('Error fetching random book:', error);
    res.status(500).json({ message: 'Error fetching random book' });
  }
});

//search-books
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: 'Search query is required' 
      });
    }

    console.log('Search query received:', query);

    const books = await Books.find({
      $or: [
        { bookName: { $regex: query, $options: 'i' } },  
        { authorName: { $regex: query, $options: 'i' } },
        {category: {$regex: query, $options:'i'}},  
        {description: {$regex: query, $options:'i'}}  
      ]
    }).select('bookName authorName price imageUrl'); // Updated field names

    console.log('Search results:', books);

    return res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });

  } catch (error) {
    console.error('Search error details:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * Get a single book by ID
 * @route GET /api/books/:id
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    const book = await Books.findById(req.params.id).select('-__v');
    
    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }
    
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * Create a new book
 * @route POST /api/books
 * @access Public
 */
router.post('/', async (req, res) => {
  try {
    const { bookName, authorName, price } = req.body;
    
    if (!bookName || !authorName || !price) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: bookName, authorName, price' 
      });
    }

    const newBook = new Books({
      bookName,
      authorName,
      price
    });

    const savedBook = await newBook.save();
    res.status(201).json({ success: true, data: savedBook });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * Update a book by ID
 * @route PUT /api/books/:id
 * @access Public
 */
router.put('/:id', async (req, res) => {
  try {
    // Log the incoming request body
    console.log('Request body:', req.body);
    
    const updates = {
      bookName: req.body.bookName,
      authorName: req.body.authorName,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description,
      // Keep other fields as needed
    };
    
    // Remove undefined fields
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);
    
    // Log the updates object
    console.log('Updates to be applied:', updates);
    
    const updatedBook = await Books.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!updatedBook) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }

    res.status(200).json({ success: true, data: updatedBook });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.put('/:id/secondary-images', upload.array('images', 5), async (req, res) => {
  try {
      const book = await Books.findById(req.params.id);
      if (!book) {
          return res.status(404).json({ success: false, error: 'Book not found' });
      }

      if (!req.files || req.files.length === 0) {
          return res.status(400).json({ success: false, error: 'Please upload images' });
      }

      // Upload each image to Cloudinary and collect their data
      const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
      const uploadedImages = await Promise.all(uploadPromises);

      // Format the images data for MongoDB
      const secondaryImages = uploadedImages.map(result => ({
          imageUrl: result.secure_url,
          imagePublicId: result.public_id
      }));

      // Update the book with secondary images
      const updatedBook = await Books.findByIdAndUpdate(
          req.params.id,
          { $set: { secondaryImages } },
          { new: true }
      );

      res.json({ success: true, data: updatedBook });
  } catch (error) {
      console.error('Error updating secondary images:', error);
      res.status(500).json({ success: false, error: 'Error updating secondary images' });
  }
});

// Route to delete secondary images if needed
router.delete('/:id/secondary-images', async (req, res) => {
  try {
      const book = await Books.findById(req.params.id);
      if (!book) {
          return res.status(404).json({ success: false, error: 'Book not found' });
      }

      // Delete images from Cloudinary
      const deletePromises = book.secondaryImages.map(image => 
          cloudinary.uploader.destroy(image.imagePublicId)
      );
      await Promise.all(deletePromises);

      // Remove secondary images from the book
      book.secondaryImages = [];
      await book.save();

      res.json({ success: true, message: 'Secondary images deleted successfully' });
  } catch (error) {
      console.error('Error deleting secondary images:', error);
      res.status(500).json({ success: false, error: 'Error deleting secondary images' });
  }
});

/**
 * Delete a book by ID
 * @route DELETE /api/books/:id
 * @access Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedBook = await Books.findByIdAndDelete(req.params.id).select('-__v');

    if (!deletedBook) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }

    res.status(200).json({ success: true, data: deletedBook });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

module.exports = router;