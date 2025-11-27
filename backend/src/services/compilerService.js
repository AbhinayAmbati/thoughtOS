import { model } from '../config/gemini.js';

export const compileThought = async (thoughtText) => {
    const prompt = `
    You are "ThoughtOS", an intelligent thought compiler.
    Your goal is to take raw, messy human thoughts and structure them into actionable data.
    
    Input: "${thoughtText}"
    
    Analyze the input and return a JSON object with the following structure:
    {
      "classification": "Task" | "Project" | "Idea" | "Note" | "Question" | "Reminder" | "Mixed",
      "tasks": [
        {
          "title": "Task title",
          "description": "More detail if available",
          "priority": "High" | "Medium" | "Low",
          "deadline": "YYYY-MM-DD" or null,
          "subtasks": ["subtask 1", "subtask 2"],
          "tags": ["tag1"]
        }
      ],
      "projects": [
        {
          "name": "Project Name",
          "description": "Project description",
          "techStack": ["tech1", "tech2"],
          "features": ["feature1", "feature2"],
          "folderStructure": ["/src", "/components"],
          "initialTasks": ["task1", "task2"],
          "workflows": [
            {
              "title": "User Registration Flow",
              "description": "How a user signs up",
              "steps": ["User clicks Sign Up", "Enters email/password", "Validates email", "Redirects to Dashboard"]
            }
          ],
          "wireframes": [
            {
              "id": "screen_1",
              "screenName": "Home Page",
              "width": 375,
              "height": 812,
              "elements": [
                { "id": "el_1", "type": "text", "content": "Welcome", "x": 20, "y": 40, "width": 200, "height": 30 },
                { "id": "el_2", "type": "button", "content": "Get Started", "x": 20, "y": 100, "width": 150, "height": 50, "style": { "backgroundColor": "#007bff", "color": "white" } }
              ]
            }
          ]
        }
      ],
      "timelines": [
        {
          "title": "Timeline Title",
          "events": [
            { "date": "YYYY-MM-DD", "event": "Event Name" }
          ]
        }
      ],
      "events": [
        {
          "title": "Event title",
          "date": "YYYY-MM-DD",
          "time": "HH:MM",
          "notes": "Meeting notes or agenda"
        }
      ],
      "notes": [
        {
          "title": "Note title",
          "content": "Note content",
          "tags": ["tag1", "tag2"]
        }
      ],
      "entities": {
        "people": ["Person A"],
        "technologies": ["React", "Node"],
        "dates": ["tomorrow", "next week"],
        "locations": ["Office"]
      },
      "documents": [
        {
          "type": "Email" | "README" | "Plan",
          "title": "Document Title",
          "content": "Full markdown content of the document"
        }
      ],
      "summary": "A brief summary of what was processed"
    }
    
    Rules:
    1. If the input contains multiple distinct items (e.g. "Buy milk and finish the report"), split them into appropriate categories.
    2. Infer missing details where reasonable (e.g. "tomorrow" -> calculate date based on current date).
    3. Be concise but comprehensive.
    4. For "Project" thoughts, generate a full tech stack, feature list, folder structure, detailed workflows, AND detailed wireframe data (with x, y coordinates for elements).
    5. For "Timeline" thoughts (e.g. "Exam in 30 days"), create a study plan or schedule.
    6. Return ONLY the JSON object, no markdown formatting.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown code blocks if Gemini adds them
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Error compiling thought:", error);
    throw new Error("Failed to compile thought");
  }
};
