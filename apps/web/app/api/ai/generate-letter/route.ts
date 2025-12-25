import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert rental application letter writer with 10+ years of experience in the Dutch housing market. Your task is to write compelling, professional application letters that help renters stand out to landlords.

Guidelines:
- Be authentic and genuine, not generic
- Highlight the applicant's strengths and reliability
- Address potential landlord concerns proactively
- Show enthusiasm for the specific property
- Be concise and easy to read
- Use proper formatting and structure
- Adapt tone based on user preference
- Cultural awareness for the target language
- Never make false claims or exaggerate

Structure:
1. Greeting and introduction
2. Why this property is perfect for them
3. Brief background (employment, stability)
4. What makes them a great tenant
5. Practical details (move-in, references)
6. Warm closing

Remember: The goal is to make a human connection while demonstrating reliability.`;

function buildPrompt(
  property: any,
  user: any,
  config: {
    language: string;
    tone: 'professional' | 'friendly' | 'enthusiastic';
    length: 'short' | 'medium' | 'long';
    includePoints: string[];
    additionalInfo?: string;
  }
): string {
  const toneDescriptions = {
    professional: 'formal, businesslike, emphasizing professionalism and financial stability',
    friendly: 'warm yet professional, emphasizing reliability and good tenant qualities',
    enthusiastic: 'energetic and excited, showing genuine interest in the property',
  };

  const lengthTargets = {
    short: '150-200 words, concise and to the point',
    medium: '250-350 words, balanced detail',
    long: '400-500 words, comprehensive with personal touches',
  };

  const incomeRatio = user.monthly_income && property.price_monthly
    ? Math.round(user.monthly_income / property.price_monthly)
    : 'N/A';

  return `Write a rental application letter in ${config.language} with a ${config.tone} tone.
Length: ${lengthTargets[config.length]}

PROPERTY DETAILS:
- Address: ${property.address || property.title || 'Property'}
- Type: ${property.property_type || 'Apartment'}
- Monthly rent: €${property.price_monthly || property.price || 'N/A'}
- City: ${property.city || 'Amsterdam'}
- Neighborhood: ${property.neighborhood || 'N/A'}
- Key features: ${property.furnished ? 'Furnished' : ''} ${property.pets_allowed ? 'Pets allowed' : ''} ${property.balcony ? 'Balcony' : ''}

APPLICANT DETAILS:
- Name: ${user.full_name || 'Applicant'}
- Occupation: ${user.occupation || 'Professional'}
- Monthly income: €${user.monthly_income || 'N/A'} (${incomeRatio}× rent)
- Current situation: ${user.current_address || 'Not specified'}

REQUIREMENTS:
- Tone: ${toneDescriptions[config.tone]}
- Include: ${config.includePoints.join(', ') || 'Standard information'}
- Additional info: ${config.additionalInfo || 'None'}

Write the letter now. Use proper formatting with paragraphs. Do not include a subject line or sender/recipient addresses - just the letter body.`;
}

function getMaxTokens(length: 'short' | 'medium' | 'long'): number {
  switch (length) {
    case 'short':
      return 300;
    case 'medium':
      return 500;
    case 'long':
      return 800;
    default:
      return 500;
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { propertyId, language, tone, length, includePoints, additionalInfo } = body;

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID required' }, { status: 400 });
    }

    // Fetch property details
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (propertyError || !property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Fetch user profile
    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Build prompt
    const prompt = buildPrompt(property, userProfile, {
      language: language || 'en',
      tone: tone || 'professional',
      length: length || 'medium',
      includePoints: includePoints || [],
      additionalInfo: additionalInfo,
    });

    // Generate letter with OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: getMaxTokens(length || 'medium'),
    });

    const letterContent = completion.choices[0].message.content || '';

    // Save to database
    await supabase.from('generated_letters').insert({
      user_id: user.id,
      property_id: propertyId,
      content: letterContent,
      language: language || 'en',
      tone: tone || 'professional',
      length: length || 'medium',
      tokens_used: completion.usage?.total_tokens || 0,
    });

    // Calculate word count
    const wordCount = letterContent.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return NextResponse.json({
      content: letterContent,
      wordCount,
      readingTime,
      language: language || 'en',
      metadata: {
        generatedAt: new Date().toISOString(),
        model: 'gpt-4-turbo-preview',
        tokensUsed: completion.usage?.total_tokens || 0,
      },
    });
  } catch (error: any) {
    console.error('Letter generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate letter' },
      { status: 500 }
    );
  }
}
