import { NextFunction, Response, Router } from 'express';

import auth from '../middleware/auth';
import Task from '../models/Task';
import { RequestWithUser } from '../types';
import { MongooseError } from 'mongoose';

const taskRouter = Router();

taskRouter.get('/', auth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userTasks = await Task.find({user: req.user?._id});

    return res.send(userTasks);
  } catch (error) {
    res.status(500).send({message: error});

    next(error);
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

taskRouter.put('/:id', auth, async (req: RequestWithUser, res: Response) => {
  const taskId = req.params.id;
  const {title, description, status} = req.body;

  try {
    const task = await Task.findOne({_id: taskId, user: req.user?._id});

    if (!task) {
      return res.status(403).send({message: 'No such task on your user account'});
    }

    task.title = title;
    task.description = description;
    task.status = status;

    await task.save();

    res.status(200).send({message: 'Task changed', task});
  } catch (error) {
    res.status(500).send({message: error});
  }
});

taskRouter.delete('/:id', auth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const taskId = req.params.id;

  try {
    await Task.deleteOne({_id: taskId, user: req.user?._id});

    res.status(204).send({message: 'Deleted successfully'});
  } catch (error) {
    res.status(500).send({message: error});

    next(error);
  }
});

export default taskRouter;
