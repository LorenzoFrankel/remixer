import express from 'express';
import cors from 'cors';
import { Anthropic } from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { systemPrompt } from './src/config/prompts';

dotenv.config();

const app = express();
const port = 3000;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.use(cors());
app.use(express.json());

app.post('/api/remix', async (req, res) => {
  const { text, format } = req.body;
  console.log('Received request:', { format, textLength: text.length });

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      temperature: 0.3,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: [{
          type: 'text',
          text: `Convert this text into a ${format} format:

${text}

Remember to maintain the original meaning while optimizing for the ${format} format.`
        }]
      }]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    console.log('Claude response:', responseText);
    
    let options = responseText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    console.log('Initial split:', options);

    options = options
      .map(line => line.replace(/^\d+\.\s*/, ''))
      .map(line => line.replace(/^\s*[-•]\s*/, ''))
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 6);
    console.log('Final options:', options);

    res.json({ results: options });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ message: 'Error processing request' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 