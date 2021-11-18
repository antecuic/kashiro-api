import express from 'express';
import mongoose from 'mongoose';
// import passport from 'passport';
import session from 'express-session';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routers/userRouter';
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
// app.use(passport.initialize());
// app.use(passport.session());

// TODO: Check following code for missing properties or properties that aren't in use
// Add route for handling 404's

// Routes
app.use('/user', userRouter);
app.use('/balance', balanceRouter);

app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({ error: err });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found.' });
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
