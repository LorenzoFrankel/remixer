# Content Remixer

A web application that uses Claude AI to rewrite text in different styles.

## Features

- Rewrite text in formal, casual, or funny styles
- Real-time text transformation using Claude AI
- Modern React UI with Tailwind CSS

## Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd content-remixer
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Anthropic API key:
```
ANTHROPIC_API_KEY=your-api-key
```

4. Start the development server:
```bash
# Terminal 1: Start the API server
npm run server

# Terminal 2: Start the frontend
npm run dev
```

5. Open your browser and navigate to the URL shown in the terminal (typically http://localhost:5173)

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- Express
- Claude AI (Anthropic)