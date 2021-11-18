import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
// import passport from 'passport';
import session from 'express-session';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routers/userRouter';
import authRouter from './routers/authRouter';
import balanceRouter from './routers/balanceRouter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;
const isDev = process.env.NODE_ENV === 'development';

if (isDev) app.use(morgan('dev'));
app.use(express.json());
app.use(
  cors({
    origin: isDev ? 'http://localhost:8080' : 'my.domain.com',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

// Routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/balance', balanceRouter);

app.use((err, req: Request, res: Response) => {
  res.sendStatus(500);
  res.json({ error: err });
});

app.use((req: Request, res: Response) => {
  res.sendStatus(404).json({ message: 'Not found.' });
});

// Mongoose connect
mongoose
  .connect(`${process.env.DB_CONNECTION}`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('>> Connected to database <<'))
  .catch((err) => console.log(err.message));

app.listen(PORT, () =>
  console.log(`>> Server running on http://localhost:${PORT} <<`)
);
