const express = require('express');
const router = express.Router();
const { 
  getOrders, 
  getArtistOrders, 
  getAdminOrders, 
  createOrder, 
  updateOrder, 
  deleteOrder, 
  uploadProof 
} = require('../controllers/orderController');
const { auth, isArtist, isAdmin } = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now();
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${uniquePrefix}-${basename}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
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

router.get('/', auth, getOrders);
router.get('/artist', auth, isArtist, getArtistOrders);
router.get('/admin', auth, isAdmin, getAdminOrders);
router.post('/', auth, upload.single('picture'), createOrder);
router.put('/:id', auth, isArtist, updateOrder);
router.delete('/:id', auth, deleteOrder);
router.post('/:id/proof', auth, isArtist, upload.single('proof'), uploadProof);

module.exports = router;