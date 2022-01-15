import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';

// for testing purposes only

const getUser = async (req: Request, res: Response) => {
  User.findById(req.body.id).then((user) => {
    if (user) {
      res.status(200).json(user);
    }
  });
};

const login = async (req: Request, res: Response) => {
  // get data sent from client
  const { email, password } = req.body;

  const user = await User.findOne({ email }).then((fetchedUser) => {
    if (!fetchedUser) {
      res.status(400).json("Couldn't find user with provieded email");
    } else {
      bcrypt.compare(password, fetchedUser.password, (err, result) => {
        if (err) {
          res.status(500).json({ error: 'Something went wrong' });
        }

        if (result) {
          jwt.sign(
            { user },
            process.env.SECRET_KEY,
            // token will be invalid after two hours
            { expiresIn: '2h' },
            (error, token) => {
              if (error) {
                res.sendStatus(403);
              } else {
                // get user data from database and send in response with token
                res.json({ token, user: fetchedUser });
              }
            }
          );
        } else {
          res.status(400).json('Invalid password provided');
        }
      });
    }
  });
};
const register = (req: Request, res: Response) => {
  const { email, username, surname, name, password } = req.body;

  User.findOne({ email }).then((user) => {
    if (user) {
      return res
        .json({ email: 'User with this email already exists. Please log in.' })
        .status(400);
    }
    const newUser = new User({
      email,
      username,
      surname,
      name,
      password,
      balance: 0,
    });

    newUser.save();
    return res.json({ newUser }).status(200);
  });
};

const logout = (req, res) => {
  res.send({ message: 'Logout' });
};

export { login, register, logout, getUser };
