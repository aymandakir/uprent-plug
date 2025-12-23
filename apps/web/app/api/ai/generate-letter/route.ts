import { NextRequest, NextResponse } from "next/server";
import { generateApplicationLetter, LetterInputSchema } from "@rentfusion/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = LetterInputSchema.parse(body);
    const letter = await generateApplicationLetter(validatedData);
    return NextResponse.json(letter);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Letter generation error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to generate letter" }, { status: 500 });
  }
}

export const runtime = "nodejs";
export const maxDuration = 30;

