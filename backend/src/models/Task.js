import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  status: { type: String, enum: ['Todo', 'Doing', 'Done'], default: 'Todo' },
  deadline: Date,
  subtasks: [String],
  tags: [String],
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Task', taskSchema);
