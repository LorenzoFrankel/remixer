import { Anthropic } from '@anthropic-ai/sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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

    return res.status(200).json({ result: message.content[0].text });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error processing request' });
  }
}
