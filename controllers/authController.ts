import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// for testing purposes only

const getUser = (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, (err, response) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        response,
      });
    }
  });
};

const login = (req: Request, res: Response) => {
  // get data sent from client

  const user = {
    id: 1,
    name: 'Ante',
    mail: 'ante@mail.com',
  };

  jwt.sign(
    { user },
    process.env.SECRET_KEY,
    // token will be invalid after two hours
    { expiresIn: '2h' },
    (err, token) => {
      if (err) {
        res.sendStatus(403);
      } else {
        // get user data from database and send in response with token
        res.json({ token });
      }
    }
  );
};
const register = (req, res) => {
  res.send({ message: 'Register' });
};

const logout = (req, res) => {
  res.send({ message: 'Logout' });
};

export { login, register, logout, getUser };
