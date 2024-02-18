import mongoose, { Schema, Types } from 'mongoose';
import User from './User';

const TaskSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => await User.findById(value),
      message: 'User not found'
    }
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'complete'],
    required: true
  },
});

const Task = mongoose.model('Task', TaskSchema);

export default Task;