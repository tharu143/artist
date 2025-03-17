const express = require('express');
const router = express.Router();
const { getProducts, createProduct } = require('../controllers/productController');
const { auth, isArtist } = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now(); // Unique timestamp
    const ext = path.extname(file.originalname); // Extract original extension (e.g., .jpg, .png)
    const basename = path.basename(file.originalname, ext); // Original name without extension
    cb(null, `${uniquePrefix}-${basename}${ext}`); // e.g., 1742184035627-ColorPencilDrawing.jpg
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']; // Add more as needed
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.get('/', getProducts);
router.post('/', auth, isArtist, upload.single('image'), createProduct);

module.exports = router;