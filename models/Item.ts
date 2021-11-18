import mongoose, { Schema } from 'mongoose';

const itemSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  timestamp: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: [true, 'Description must be provided.'],
    min: [4, 'Description must contain at least 4 characters.'],
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
});

export default mongoose.model('Item', itemSchema);
