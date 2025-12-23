import OpenAI from "openai";
import { z } from "zod";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Input validation schema
export const LetterInputSchema = z.object({
  // User info
  fullName: z.string().min(2),
  age: z.number().optional(),
  occupation: z.string(),
  monthlyIncome: z.number(),
  currentLocation: z.string(),
  moveReason: z.string(),
  hobbies: z.array(z.string()).optional(),
  hasPets: z.boolean().default(false),
  petDescription: z.string().optional(),

  // Property info
  propertyTitle: z.string(),
  propertyCity: z.string(),
  propertyType: z.enum(["apartment", "studio", "house", "room"]),
  propertyPrice: z.number(),
  landlordName: z.string().optional(),
  landlordType: z.enum(["private", "agency", "corporation"]).optional(),

  // Preferences
  language: z.enum(["en", "nl"]).default("en"),
  tone: z.enum(["professional", "friendly", "formal"]).default("friendly"),
  includePhoto: z.boolean().default(false),
  customPrompt: z.string().optional()
});

export type LetterInput = z.infer<typeof LetterInputSchema>;

export interface GeneratedLetter {
  content: string;
  subject: string;
  language: "en" | "nl";
  wordCount: number;
  generatedAt: string;
  tokensUsed: number;
}

export async function generateApplicationLetter(input: LetterInput): Promise<GeneratedLetter> {
  const validatedInput = LetterInputSchema.parse(input);

  const systemPrompt = buildSystemPrompt(validatedInput);
  const userPrompt = buildUserPrompt(validatedInput);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 800,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.3
    });

    const choice = completion.choices?.[0]?.message?.content ?? "";
    const tokensUsed = completion.usage?.total_tokens ?? 0;

    const lines = choice.split("\n").filter((l) => l.trim().length > 0);
    const firstLine = lines[0] ?? "";
    const subject =
      firstLine.replace(/^(Subject:|Onderwerp:)/i, "").trim() ||
      `Application for ${validatedInput.propertyTitle}`;

    const letterBody = lines.slice(1).join("\n").trim();

    return {
      content: letterBody,
      subject,
      language: validatedInput.language,
      wordCount: letterBody ? letterBody.split(/\s+/).length : 0,
      generatedAt: new Date().toISOString(),
      tokensUsed
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate letter. Please try again.");
  }
}

function buildSystemPrompt(input: LetterInput): string {
  const languageInstructions =
    input.language === "nl"
      ? 'You write in perfect Dutch (Nederlands). Use formal "u" when tone is professional/formal, "je" when friendly.'
      : "You write in clear, professional English.";

  const toneInstructions: Record<LetterInput["tone"], string> = {
    professional: "Use a professional, business-like tone. Be concise and respectful.",
    friendly: "Use a warm, personable tone while maintaining professionalism. Show personality.",
    formal: "Use very formal language. Be respectful and traditional in approach."
  };

  return `You are an expert rental application letter writer in the Netherlands. Your goal is to help renters secure viewings by writing compelling, authentic application letters.

${languageInstructions}

TONE: ${toneInstructions[input.tone]}

CRITICAL RULES:

Letters must be 250-350 words (not longer!)
Start with a subject line (Subject: ... or Onderwerp: ...)
Address landlord directly if name provided, otherwise "Dear Sir/Madam" or "Geachte heer/mevrouw"
Show genuine interest in the SPECIFIC property (mention details)
Highlight financial stability (income, employment)
Address any concerns proactively (pets, moving reason)
Express urgency and availability for viewing
End with clear call-to-action for viewing
NEVER lie or exaggerate - be authentic
NEVER use generic templates - personalize every letter

STRUCTURE:
- Subject line
- Greeting
- Introduction (who you are, why this property)
- Body (qualifications, lifestyle fit, financial stability)
- Closing (availability, call-to-action)
- Signature

Make the landlord WANT to meet this person.`;
}

function buildUserPrompt(input: LetterInput): string {
  const lines = [
    "Write an application letter for this rental property:",
    "",
    "PROPERTY:",
    `Title: ${input.propertyTitle}`,
    `City: ${input.propertyCity}`,
    `Type: ${input.propertyType}`,
    `Monthly rent: €${input.propertyPrice}`,
    input.landlordName ? `Landlord: ${input.landlordName}` : "",
    input.landlordType ? `Landlord type: ${input.landlordType}` : "",
    "",
    "APPLICANT:",
    `Name: ${input.fullName}`,
    input.age ? `Age: ${input.age}` : "",
    `Occupation: ${input.occupation}`,
    `Monthly income: €${input.monthlyIncome}`,
    `Currently living in: ${input.currentLocation}`,
    `Reason for moving: ${input.moveReason}`,
    input.hobbies?.length ? `Hobbies: ${input.hobbies.join(", ")}` : "",
    input.hasPets ? `Has pets: ${input.petDescription || "Yes"}` : "",
    "",
    "REQUIREMENTS:",
    `Language: ${input.language === "nl" ? "Dutch (Nederlands)" : "English"}`,
    `Tone: ${input.tone}`,
    input.customPrompt ? `SPECIAL REQUEST: ${input.customPrompt}` : "",
    "",
    `Write a compelling letter that will get ${input.fullName} a viewing appointment.`
  ]
    .filter(Boolean)
    .join("\n");

  return lines;
}

export { openai };

