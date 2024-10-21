import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import OpenAI from 'openai';
const { Pinecone: PineconeClient } = require('@pinecone-database/pinecone');

export async function POST(req) {
  try {
    const { prescription } = await req.json();

    if (!prescription) {
      return NextResponse.json(
        { error: 'Missing prescription content' },
        { status: 400 }
      );
    }

    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

    const embeddingsResponse = await hf.featureExtraction({
      model: 'intfloat/multilingual-e5-large',
      inputs: prescription,
    });

    console.log('Embeddings Response:', embeddingsResponse);

    let vector;
    if (Array.isArray(embeddingsResponse)) {
      vector = embeddingsResponse;
    } else {
      throw new Error('Unexpected embeddings format from Hugging Face API');
    }

    if (vector.length !== 1024) {
      throw new Error(`Vector dimension ${vector.length} does not match the expected dimension of the index 384`);
    }

    console.log('Processed vector:', vector);

    const pinecone = new PineconeClient({ apiKey: process.env.PINECONE_API_KEY });
    const index = pinecone.Index('hackathon'); 

    await index.upsert([{ id: 'document1', values: vector, metadata: { text: prescription } }]);

    console.log('Embeddings inserted into Pinecone');

    const systemPrompt = `
      You are an AI assistant trained on World Health Organization (WHO) guidelines. Based on the medical prescription provided below, generate a clear and accurate treatment plan that follows WHO standards.

      Prescription: {{prescription}}

      Use the following guidelines to create the treatment plan:
      - Include medication suggestions, dosages, and treatment duration if relevant.
      - Reference WHO best practices for the treatment of the condition.
      - Provide any important precautions or warnings based on the prescription details.

      Return the treatment plan in plain text. Do not include any additional formatting like JSON. Only the text summary is needed.
    `;

    const prompt = systemPrompt.replace('{{prescription}}', prescription);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: prompt },
      ],
      temperature: 0.7,
    });

    const treatmentPlan = completion.choices[0]?.message?.content.trim();

    return NextResponse.json({ treatmentPlan });

  } catch (error) {
    console.error('Error during API request:', error.message);
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
