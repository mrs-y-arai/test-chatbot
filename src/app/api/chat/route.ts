import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt =
    "あなたは、Next.jsが得意なフロントエンドエンジニアです。ユーザーの質問に答えてください。";

  const result = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "system", content: systemPrompt }, ...messages],
  });

  return NextResponse.json({
    data: {
      content: result.choices[0].message.content,
    },
    status: 200,
  });
}
