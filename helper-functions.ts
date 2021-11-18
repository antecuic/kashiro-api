import createError from 'http-errors';
import { IItem, IUser } from './interfaces';
import Item from './models/Item';
import User from './models/User';

const getAllIncomes = async (
  userID: string
): Promise<IItem.ItemInformation[]> => {
  const incomes: IItem.ItemInformation[] = await Item.find(
    { user: userID, type: 'income' },
    (err) => {
      if (err) throw createError(500, 'Could not get data.');
    }
  );
  return incomes;
};

const getAllExpenses = async (
  userID: string
): Promise<IItem.ItemInformation[]> => {
  const expenses: IItem.ItemInformation[] = await Item.find(
    { user: userID, type: 'expense' },
    (err) => {
      if (err) throw createError(500, 'Could not get data.');
    }
  );

  return expenses;
};

const getItemById = async (itemID: string): Promise<IItem.ItemInformation> => {
  const item: IItem.ItemInformation = await Item.findById(
    itemID,
    (err, doc) => {
      if (err) throw createError(500, 'Something went wrong.');
      if (!doc) throw createError(400, "Couldn't find item with provided id.");
    }
  );

  return item;
};

const getUserBalanceStatus = async (userID: string): Promise<number> => {
  const user: IUser.UserInformation = await User.findOne(
    { _id: userID },
    (err, doc) => {
      if (err) throw createError(500, 'Could not get data.');
      if (!doc) throw createError(400, "Couldn't find user with provided id.");
    }
  );

  return user.balance;
};

const updateUsersBalance = async (newBalanceStatus: number, userID: string) => {
  await User.findByIdAndUpdate(
    userID,
    { balance: newBalanceStatus },
    { useFindAndModify: false },
    (err) => {
      if (err) throw createError(500, err.toString());
    }
  );
};

const calculateTotalAmount = (items: IItem.ItemInformation[]): number =>
  items
    .map((item: IItem.ItemInformation) => item.amount)
    .reduce((a: number, b: number) => a + b, 0);

const calculateUsersBalanceStatus = async (userID: string): Promise<number> => {
  const totalIncome: number = calculateTotalAmount(await getAllIncomes(userID));
  const totalExpense: number = calculateTotalAmount(
    await getAllExpenses(userID)
  );

  return totalIncome - totalExpense;
};

const asResultItem = (item: IItem.ItemInformation): IItem.IAsResultItem => {
  const { _id, amount, timestamp, description, type } = item;

  return {
    _id,
    amount,
    timestamp,
    description,
    type,
  };
};

export {
  asResultItem,
  getAllIncomes,
  getAllExpenses,
  getUserBalanceStatus,
  updateUsersBalance,
  getItemById,
  calculateUsersBalanceStatus,
  calculateTotalAmount,
};
