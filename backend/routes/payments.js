const express = require('express');
const router = express.Router();
const { 
  getPayments, 
  getArtistPayments, 
  updatePayment, 
  createPayment, 
  deletePayment 
} = require('../controllers/paymentController');
const { auth, isAdmin, isArtist } = require('../middlewares/auth');

router.get('/', auth, isAdmin, getPayments);
router.get('/artist', auth, isArtist, getArtistPayments);
router.put('/:id', auth, isAdmin, updatePayment);
router.post('/', auth, isAdmin, createPayment);
router.delete('/:id', auth, isAdmin, deletePayment);

module.exports = router;