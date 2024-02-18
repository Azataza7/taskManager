import { Router } from 'express';
import User from '../models/User';
import { typeUserWithoutToken } from '../types';
import { mongo } from 'mongoose';
import bcrypt from 'bcrypt';

const userRouter = Router();

userRouter.get('/', async (req, res, next) => {
  const results = await User.find();

  return res.send(results);
});

userRouter.post('/', async (req, res, next) => {
  try {
    const user: typeUserWithoutToken = {
      username: req.body.username,
      password: req.body.password,
    };

    const newUser = new User(user);

    newUser.generateToken();

    await newUser.save();

    return res.status(201).send(newUser);
  } catch (e) {
    if (e instanceof mongo.MongoServerError && e.code === 11000) {
      return res.status(422).send({message: 'username should be unique!'});
    }

    next(e);
  }
});

userRouter.post('/sessions', async (req, res, next) => {
  try {
    const user = await User.findOne({username: req.body.username});

    if (!user || !(user.checkPassword(req.body.password))) {
      return res.status(400).send({error: 'Username or password is wrong'});
    }

    return res.send({message: 'Success!', user});
  } catch (e) {
    next(e);
  }
});

export default userRouter;
