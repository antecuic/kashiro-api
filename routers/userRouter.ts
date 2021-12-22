import express from 'express';
import verifyToken from '../config/verifyToken';
import {
  getUser,
  getCurrentBalance,
  getExpenseList,
  getIncomeList,
} from '../controllers/userController';

const router = express.Router();

router.get('/', verifyToken, getUser);
router.get('/current-balance', verifyToken, getCurrentBalance);
router.get('/income-list', verifyToken, getIncomeList);
router.get('/expense-list', verifyToken, getExpenseList);

export default router;
