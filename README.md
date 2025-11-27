# ThoughtOS

ThoughtOS is an intelligent thought compiler that converts raw human thoughts into structured actions.

## Prerequisites

- Node.js
- MongoDB
- Gemini API Key

## Setup

### Backend

1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file (if not exists) and add your Gemini API Key:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/thoughtos
   GEMINI_API_KEY=your_api_key_here
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open the frontend in your browser (usually `http://localhost:5173`).
2. Type your thoughts in the input box.
3. Click the send button to compile your thoughts into structured data.
