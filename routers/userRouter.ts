import express from 'express';
import {
  getUser,
  getCurrentBalance,
  getExpenseList,
  getIncomeList,
} from '../controllers/userController';

const router = express.Router();

router.get('/', getUser);
router.get('/current-balance', getCurrentBalance);
router.get('/income-list', getIncomeList);
router.get('/expense-list', getExpenseList);

export default router;
