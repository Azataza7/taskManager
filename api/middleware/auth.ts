import { NextFunction, Response} from 'express';
import User from '../models/User';
import { RequestWithUser } from '../types';

const auth = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({error: 'Token not provided!'});
  }

  const user = await User.findOne({token});

  if (!user) {
    return res.status(401).send({error: 'User not found!'});
  }

  req.user = user;
  next();
};

export default auth;