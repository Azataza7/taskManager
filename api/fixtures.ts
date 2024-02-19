import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import Task from './models/Task';
import crypto from 'crypto';

const run = async () => {
  await mongoose.connect(config.mongoose.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection('tasks');
    await db.dropCollection('users');
  } catch (e) {
    console.log('Collections were not present, skipping drop');
  }

  const userToken = crypto.randomUUID();
  const user1Token = crypto.randomUUID();

  const user = new User({
    username: 'admin',
    password: 'admin123',
    token: userToken
  });

  const user1 = new User({
    username: 'admin1',
    password: 'admin123',
    token: user1Token
  });

  await user.save();
  await user1.save();

  const task1 = new Task({
    user: user._id,
    title: 'first task',
    description: 'Description for task1',
    status: 'new'
  });

  const task2 = new Task({
    user: user1._id,
    title: 'Task 2',
    description: 'Description for Task 2',
    status: 'in_progress'
  });

  await task1.save();
  await task2.save();

  await db.close();
};

run().catch(console.error);
