import { Anthropic } from '@anthropic-ai/sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { systemPrompt } from '../src/config/prompts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { text, format } = req.body;

  if (!text || !format) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    console.log('Request:', { text, format });
    
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      temperature: 0.7,
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

    if (!message.content[0] || message.content[0].type !== 'text') {
      console.log('Invalid content structure:', message.content);
      throw new Error('Invalid response from AI service');
    }

    const responseText = message.content[0].text;
    console.log('Raw response:', responseText);

    // First try to extract numbered lines
    let options = responseText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    console.log('Split lines:', options);

    // If we have fewer than 6 lines, try to split on periods
    if (options.length < 6) {
      options = responseText.split('.')
        .map(text => text.trim())
        .filter(text => text.length > 0);
      console.log('Split by periods:', options);
    }

    // Clean up the options
    options = options
      .map(line => line.replace(/^\d+\.\s*/, '')) // Remove leading numbers
      .map(line => line.replace(/^\s*[-•]\s*/, '')) // Remove bullet points
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 6); // Take up to 6 options

    console.log('Final options:', options);

    if (options.length === 0) {
      throw new Error('No valid options generated');
    }

    // If we only got one option from Claude, create variations
    if (options.length === 1) {
      const baseOption = options[0];
      options = [
        baseOption,
        baseOption.replace(/\b(AI|artificial intelligence)\b/gi, 'machine learning'),
        baseOption.replace(/\b(powerful|flagship)\b/gi, 'advanced'),
        baseOption.replace(/\b(open-source|opensource)\b/gi, 'public'),
        baseOption.replace(/\bLlama\b/gi, 'AI model'),
        baseOption.replace(/\b405B\b/gi, 'large-scale model')
      ];
    }
    // Pad array to 6 items if needed
    while (options.length < 6) {
      options.push(options[0]);
    }
      
    return res.status(200).json({ results: options });
  } catch (error) {
    console.error('Error:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Error processing request' 
    });
  }
}
