import mongoose from 'mongoose';

const thoughtSchema = new mongoose.Schema({
  rawContent: {
    type: String,
    required: true,
  },
  processedData: {
    type: Object, // Stores the JSON output from Gemini
  },
  status: {
    type: String,
    enum: ['pending', 'processed', 'accepted', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Thought = mongoose.model('Thought', thoughtSchema);

export default Thought;
