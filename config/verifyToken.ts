import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

// Verify Token

export default function verifyToken(req, res: Response, next: NextFunction) {
  // Get auth header value
  const bearerHeader = req.headers.authorization;
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    jwt.verify(req.token, process.env.SECRET_KEY, (err) => {
      if (err) {
        res.sendStatus(403);
      } else {
        // Next middleware
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
}
