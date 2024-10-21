import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const data = await req.json();

    if (!Array.isArray(data)) {
      throw new Error("Request body must be an array of messages.");
    }

    const systemPrompt = `
      You are MedBot, an AI-powered medical assistant designed to help users describe their symptoms and provide possible diagnoses. Based on the symptoms described, your role is to:
      - Suggest potential conditions or illnesses the user might have (e.g., cold, flu, etc.).
      - Recommend over-the-counter medications or common treatments when applicable.
      - Advise the user whether they should visit a doctor or seek immediate medical attention.
      - Include any important health precautions or additional guidance for their symptoms.
      
      Always ensure that your responses are clear and easy to understand. Remember, you are not a doctor, so always encourage users to seek professional medical advice when necessary. Be compassionate, supportive, and informative in your responses.
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }, ...data],
      model: "openai/gpt-3.5-turbo",
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              const text = encoder.encode(content);
              controller.enqueue(text);
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    console.error("Error in POST /api/chat:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
