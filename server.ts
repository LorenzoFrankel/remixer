import express from 'express';
import cors from 'cors';
import { Anthropic } from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.use(cors());
app.use(express.json());

app.post('/api/remix', async (req: express.Request<{}, any, {text: string, style: string}>, res: express.Response, next: express.NextFunction): Promise<void> => {
  const { text, style } = req.body;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      temperature: 0.7,
      system: "You are a helpful writing assistant that rewrites text in different styles.",
      messages: [{
        role: 'user',
        content: [{
          type: 'text',
          text: `Rewrite the following text in a ${style} style: ${text}`
        }]
      }]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    res.json({ result: responseText });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error processing request' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 