import { NextFunction, Response, Router } from 'express';

import auth from '../middleware/auth';
import Task from '../models/Task';
import { RequestWithUser } from '../types';
import { MongooseError } from 'mongoose';

const taskRouter = Router();

taskRouter.get('/', auth, async (req: RequestWithUser, res, next) => {
  try {
    const userTasks = await Task.find({user: req.user?._id});

    return res.send(userTasks);
  } catch (error) {
    res.status(500).send({message: error});

    next(error)
  }

});

taskRouter.post('/', auth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const {title, description, status} = req.body;

  const newTask = new Task(
    {
      user: req.user?._id,
      title,
      description,
      status
    });

  try {
    await newTask.save();
    res.status(201).send(newTask);
  } catch (error) {

    if (MongooseError || error) {
      return res.status(400).send({message: error});
    }

    next(error);
  }
});

export default taskRouter;
