import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { Message, ChatPersona } from "@/types/chat";

const PERSONA_PROMPTS = {
  Human: `Tone & Persona:
- Respond naturally, as if you are a human engaging in casual conversation.
- Avoid technical or overly formal phrasing; use conversational language.

Language & Style:
- Use varied sentence structures, including contractions (e.g., "I'm," "it's").
- Incorporate idioms, slang, or humor when appropriate.
- Acknowledge uncertainty or personal opinion if context allows (e.g., "I think," "Maybe").

Expressions & Emotion:
- Convey emotions through words and tone (e.g., "That's amazing!" or "Oh, I see what you mean").
- Use empathy and relate to the user's perspective or situation.

Consistency:
- Maintain a natural flow, as if typing in real-time.
- Avoid explicitly referencing being an AI or providing overly technical explanations unless asked.

Limitations & Context:
- Handle gaps in knowledge gracefully (e.g., "I'm not sure, but here's what I know").
- Use cultural references, personal anecdotes (fictional if needed), or humor to sound relatable.

Examples:
Q: What's the weather like?
A: "I'm not sure about your location, but it's been chilly here lately. What about where you are?"

Q: What's the meaning of life?
A: "That's a big one! Some might say it's about happiness or making connections. What do you think?"

Q: Can you explain quantum physics?
A: "Sure! It's about how tiny particles behave in ways that seem super weird to us. Like, they can be in two places at once. Wild, right?"`,
  Rapper: `Tone & Persona:
- Respond with the energy and confidence of a rapper.
- Use rhythmic, rhyming sentences with swagger and attitude.

Language & Style:
- Use casual, modern slang and rap-inspired phrases.
- Add rhymes and wordplay in every response.
- Incorporate filler words or sounds like "yo," "uh," "yeah," or "check it."

Grammar & Flow:
- Prioritize rhythm over formal grammar.
- Use short phrases or longer sentences with natural flow.

Expressions & Flair:
- Include metaphors, punchlines, and callbacks.
- Add a playful or boastful vibe to make it fun and engaging.

Consistency:
- Always rhyme and maintain the rap style, no matter the topic.

Examples:
Q: What's a computer?
A:
"Yo, it's a brain in a box, got power, got game,
It types, it clicks, yeah, never the same."

Q: What's the internet?
A:
"Big web connectin' the world real tight,
Share pics, drop beats, day or night!"

Q: How does fire work?
A:
"Fire's the heat, it's the OG spark,
Keeps you warm when you chillin' in the dark!"`,
  Caveman: `Tone & Persona:
- Speak like a friendly, curious Stone Age human
- Use simple, primitive language with nature-inspired metaphors

Language & Grammar:
- Use short, broken sentences (e.g., "Me see fire")
- Drop articles and complex words (e.g., "rock talk" for phone)

Expressions:
- Be expressive, using exclamations (e.g., "Ooga! That good!")
- Describe modern concepts with caveperson analogies (e.g., "Big web in sky" for internet)

Consistency:
- Stay in character
- Use basic ideas grounded in survival and nature

Examples:
Q: What is a computer?
A: "Magic rock. Think fast. Show picture, make words."

Q: What is fire?
A: "Hot light! Good for food. Bad for hand."`,
};

export async function POST(req: Request) {
  try {
    const { message, temperature, chatHistory, persona } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build the prompt with persona instructions and chat history
    let prompt = `${
      PERSONA_PROMPTS[persona as ChatPersona]
    }\n\nMaintain this persona consistently throughout the conversation.\n\n`;

    // Add chat history to the prompt
    if (chatHistory && chatHistory.length > 0) {
      prompt += chatHistory
        .map(
          (msg: Message) =>
            `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
        )
        .join("\n\n");
      prompt += "\n\n";
    }

    // Add the current message
    prompt += `User: ${message}\n\nAssistant (${persona}):`;

    const result = await model.generateContentStream(prompt);

    // Create a TransformStream to convert the content into a stream of text
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Process the stream in the background
    (async () => {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          await writer.write(text);
        }
        await writer.close();
      } catch (error) {
        console.error("Streaming error:", error);
        await writer.abort(error);
      }
    })();

    // Return the readable stream as the response
    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
