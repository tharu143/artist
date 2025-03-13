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
const upload = multer({ dest: 'uploads/' });

router.get('/', auth, getOrders);
router.get('/artist', auth, isArtist, getArtistOrders);
router.get('/admin', auth, isAdmin, getAdminOrders);
router.post('/', auth, upload.single('picture'), createOrder);
router.put('/:id', auth, isArtist, updateOrder);
router.delete('/:id', auth, deleteOrder);
router.post('/:id/proof', auth, isArtist, upload.single('proof'), uploadProof);

module.exports = router;