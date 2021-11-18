import express from 'express';
import {
  addItem,
  removeItem,
  updateItem,
} from '../controllers/balanceController';

const router = express.Router();

router.post('/add-item', addItem);
router.post('/remove-item', removeItem);
router.post('/update-item', updateItem);

export default router;
