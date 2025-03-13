const express = require('express');
const router = express.Router();
const { getProducts, createProduct } = require('../controllers/productController');
const { auth, isArtist } = require('../middlewares/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', getProducts);
router.post('/', auth, isArtist, upload.single('image'), createProduct);

module.exports = router;