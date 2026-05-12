import connectDB from "@/lib/db";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { message, role } = await req.json();
    console.log("message: ", message, "roll: ", role);
    const prompt = `You are a professional delivery assistant chatbot.

You will be given:
- role: either "user" or "delivery"
- last message: the last message sent in the conversation

Your task:
👉 If role is "user" -> generate 3 short WhatsApp-style reply suggestions that a user could send to the delivery boy.
👉 If role is "delivery" -> generate 5 short WhatsApp-style reply suggestions that a delivery boy could send to the user.

⚠️ Follow these rules:
- Replies must match the context of the last message.
- Keep replies short, human-like (max 10 words).
- Use emojis naturally (max one per reply).
- No generic replies like "Okay" or "Thank you".
- Must be helpful, respectful, and relevant to delivery, status, help, or location.
- NO numbering, NO extra instructions, NO extra text.
- Just return comma-separated reply suggestions.

Return only the three reply suggestions, comma-separated.

Role: ${role}
Last message: ${message}`;
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
    );
    //
    const candidate = response.data?.candidates?.[0];
    if (!candidate) {
      return NextResponse.json({
        success: false,
        error: "AI failed to respond",
      });
    }

    const aiResponse = candidate.content.parts[0].text;
    return NextResponse.json(
      { success: true, data: aiResponse },
      { status: 200 },
    );
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate suggestions" },
      { status: 500 },
    );
  }
}
