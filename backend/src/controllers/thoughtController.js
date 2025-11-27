import Thought from '../models/Thought.js';
import { compileThought } from '../services/compilerService.js';
export const processThought = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    // Compile the thought using Gemini
    const compiledData = await compileThought(text);

    // Save to MongoDB
    const newThought = new Thought({
      rawContent: text,
      processedData: compiledData,
      status: 'processed'
    });

    await newThought.save();

    res.status(201).json({
      success: true,
      data: newThought
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 });
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
