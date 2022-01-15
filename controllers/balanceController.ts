import createError from 'http-errors';
import {
  getItemById,
  getUserBalanceStatus,
  updateUsersBalance,
} from '../helper-functions';
import { IItem } from '../interfaces';
import Item from '../models/Item';
import User from '../models/User';

const addItem = async (req, res, next) => {
  const { amount, description, type, userID } = req.body;

  const newItem = new Item({
    amount,
    type,
    description,
    timestamp: new Date(),
    user: userID,
  });

  const currentBalance: number = await getUserBalanceStatus(userID);

  let newBalanceStatus: number;

  if (type === 'income') {
    newBalanceStatus = currentBalance + amount;
  } else {
    newBalanceStatus = currentBalance - amount;
  }
  console.log(`users new balance ${newBalanceStatus}`);

  await newItem.save((err) => {
    if (err) {
      return next(createError(500, err.message));
    }
  });
  await updateUsersBalance(newBalanceStatus, userID);
  res.sendStatus(200);
};

const removeItem = async (req, res, next) => {
  const itemID: string = req.body._id;

  if (!req.body.type)
    return next(createError(400, 'Type property must be provided.'));

  const item: IItem.ItemInformation = await Item.findById(
    itemID,
    (err, doc) => {
      if (err) return next(createError(err.status, err.message));
      if (!doc)
        return next(createError(400, "Couldn't find item with provided id."));
    }
  );

  const currentBalance: number = await getUserBalanceStatus(req.body.userID);
  let newBalanceStatus: number;

  if (item.type === 'income') {
    newBalanceStatus = currentBalance - item.amount;
  } else {
    newBalanceStatus = currentBalance + item.amount;
  }

  await Item.findByIdAndDelete(itemID, { useFindAndModify: false }, (err) => {
    if (err) return next(createError(500, err.message));
  });

  await updateUsersBalance(newBalanceStatus, req.body.userID);
  res.sendStatus(200);
};

const updateItem = async (req, res, next) => {
  const { _id, amount, description, type, userID } = req.body;

  const currentItem: IItem.ItemInformation = await getItemById(_id);
  let currentBalanceStatus: number = await getUserBalanceStatus(userID);

  if (currentItem.type === 'income') {
    currentBalanceStatus -= currentItem.amount;
  } else {
    currentBalanceStatus += currentItem.amount;
  }

  if (type === 'income') {
    currentBalanceStatus += amount;
  } else {
    currentBalanceStatus -= amount;
  }

  await Item.findByIdAndUpdate(
    _id,
    {
      amount,
      description,
      type,
    },
    {},
    (err) => {
      if (err) return next(createError(500, err.message));
    }
  );

  await User.findByIdAndUpdate(
    userID,
    { balance: currentBalanceStatus },
    {},
    (err) => {
      if (err) return next(createError(400, err.message));
    }
  );

  res.sendStatus(200);
};

export { addItem, removeItem, updateItem };
