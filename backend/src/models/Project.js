import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  techStack: [String],
  features: [String],
  folderStructure: [String],
  workflows: [{
    title: String,
    description: String,
    steps: [String]
  }],
  wireframes: [{
    id: { type: String },
    screenName: String,
    width: { type: Number, default: 375 }, // Mobile default
    height: { type: Number, default: 812 },
    elements: [{
      id: String,
      type: { type: String },
      content: String,
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      width: { type: Number, default: 100 },
      height: { type: Number, default: 40 },
      style: { type: Object, default: {} }
    }]
  }],
  status: { type: String, enum: ['Planning', 'Active', 'Completed'], default: 'Planning' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Project', projectSchema);
