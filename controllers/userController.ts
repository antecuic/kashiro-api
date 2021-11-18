import { IBalance, IItem } from '../interfaces';
import {
  asResultItem,
  getAllExpenses,
  getAllIncomes,
  calculateTotalAmount,
  getUserBalanceStatus,
} from '../helper-functions';

const getUser = (req, res) => {
  res.send(req.user);
};

const getCurrentBalance = async (req, res) => {
  const userID: string = req.user._id;

  const incomes: IItem.ItemInformation[] = await getAllIncomes(userID);
  const expenses: IItem.ItemInformation[] = await getAllExpenses(userID);

  const total: number = await getUserBalanceStatus(userID);

  const result: IBalance = {
    total,
    incomes: incomes
      ? incomes.map((item: IItem.ItemInformation) => asResultItem(item))
      : [],
    expenses: expenses
      ? expenses.map((item: IItem.ItemInformation) => asResultItem(item))
      : [],
  };

  res.json(result);
};

const getIncomeList = async (req, res) => {
  const userID: string = req.user._id;

  const incomes: IItem.ItemInformation[] = await getAllIncomes(userID);
  const total: number = calculateTotalAmount(incomes);

  res.json({
    total,
    incomes: incomes
      ? incomes.map((item: IItem.ItemInformation) => asResultItem(item))
      : [],
  });
};

const getExpenseList = async (req, res) => {
  const userID: string = req.user._id;

  const expenses: IItem.ItemInformation[] = await getAllExpenses(userID);
  const total: number = calculateTotalAmount(expenses);
  res.json({
    total,
    expenses: expenses
      ? expenses.map((item: IItem.ItemInformation) => asResultItem(item))
      : [],
  });
};

export { getUser, getCurrentBalance, getIncomeList, getExpenseList };
