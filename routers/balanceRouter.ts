import express from 'express';
import verifyToken from '../config/verifyToken';
import {
  addItem,
  removeItem,
  updateItem,
} from '../controllers/balanceController';

const router = express.Router();

router.post('/add-item', verifyToken, addItem);
router.post('/remove-item', verifyToken, removeItem);
router.post('/update-item', verifyToken, updateItem);

export default router;
