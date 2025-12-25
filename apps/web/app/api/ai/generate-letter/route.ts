import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
});

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI key missing' }, { status: 500 });
  }

  const { propertyId, language = 'en' } = await req.json();
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get property details
  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', propertyId)
    .single();

  if (!property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  // Generate letter
  const prompt = `Write a professional rental application letter in ${language === 'nl' ? 'Dutch' : 'English'} for this property:
Title: ${property.title}
City: ${property.city}
Price: €${property.price}/month
${property.description ? `Description: ${property.description}` : ''}

The letter should be warm, professional, and convince the landlord that the applicant is a great tenant.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  const letter = completion.choices[0].message.content;

  if (!letter) {
    return NextResponse.json({ error: 'Failed to generate letter' }, { status: 500 });
  }

  // Save to database
  await supabase.from('generated_letters').insert({
    user_id: user.id,
    property_id: propertyId,
    content: letter,
    language,
  });

  return NextResponse.json({ letter });
}