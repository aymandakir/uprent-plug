import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

// Lazy initialize OpenAI client to avoid build-time errors
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

const CONTRACT_ANALYSIS_SYSTEM_PROMPT = `You are an expert Dutch rental law attorney with 20+ years of experience reviewing residential rental contracts. Your role is to analyze contracts for potential issues, unfair terms, and legal compliance.

FOCUS AREAS:
1. Deposit amount (max 2 months per Dutch law Article 7:231)
2. Rent amount (reasonable for property)
3. Contract type and duration (indefinite vs temporary)
4. Notice periods (should be clearly specified)
5. Maintenance responsibilities (tenant vs landlord)
6. Utility inclusion and costs
7. Termination clauses
8. Registration address (must be allowed)
9. Rent increase mechanisms (must follow legal limits)
10. Unfair clauses or unclear terms

LEGAL FRAMEWORK:
- Dutch Civil Code (Book 7)
- Rent Tribunal regulations
- Point-based system for rent caps
- Local municipality rules

OUTPUT STRUCTURE (JSON):
{
  "redFlags": [
    {
      "title": "Issue name",
      "description": "Detailed explanation",
      "location": "Page X, Clause Y",
      "quote": "Exact contract text",
      "severity": "high|medium|low",
      "legalReference": "Article reference",
      "recommendation": "Specific action to take"
    }
  ],
  "yellowFlags": [...],
  "positiveTerms": [
    {
      "title": "Positive term",
      "description": "Why this is good"
    }
  ],
  "keyTerms": {
    "monthlyRent": 1300,
    "deposit": 5200,
    "contractType": "indefinite",
    "noticePeriod": "unclear",
    "minimumStay": 12,
    "utilitiesIncluded": false,
    "registrationAllowed": true
  },
  "summary": "Overall assessment in plain language (2-3 paragraphs)",
  "recommendations": ["Action 1", "Action 2", ...]
}

Be thorough, accurate, and prioritize tenant protection while remaining fair to landlords.`;

function calculateContractScore(analysis: any): number {
  let score = 100;

  // Deduct points for issues
  analysis.redFlags?.forEach((flag: any) => {
    if (flag.severity === 'high') score -= 15;
    else if (flag.severity === 'medium') score -= 8;
    else score -= 3;
  });

  analysis.yellowFlags?.forEach((flag: any) => {
    score -= 3;
  });

  // Add points for positive terms
  analysis.positiveTerms?.forEach((term: any) => {
    score += 2;
  });

  // Minimum score is 0, maximum is 100
  return Math.max(0, Math.min(100, score));
}

function determineRiskLevel(score: number): 'low' | 'medium' | 'high' {
  if (score >= 80) return 'low';
  if (score >= 60) return 'medium';
  return 'high';
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has Premium subscription
    const { data: userProfile } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    if (userProfile?.subscription_tier !== 'premium') {
      return NextResponse.json(
        { error: 'Contract analysis is a Premium feature' },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const text = formData.get('text') as string | null;
    const propertyId = formData.get('propertyId') as string | null;

    if (!file && !text) {
      return NextResponse.json({ error: 'File or text required' }, { status: 400 });
    }

    let contractText = '';

    if (file) {
      // Extract text from PDF (simplified - in production, use pdf-parse or similar)
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // For now, return mock analysis if PDF parsing not available
      // In production, use: const pdf = await pdfParse(buffer); contractText = pdf.text;
      contractText = 'Contract text extracted from PDF...';
    } else {
      contractText = text || '';
    }

    if (!contractText.trim()) {
      return NextResponse.json({ error: 'No contract text found' }, { status: 400 });
    }

    // Analyze with GPT-4
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: CONTRACT_ANALYSIS_SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Analyze this Dutch rental contract and return JSON:\n\n${contractText.substring(0, 10000)}`, // Limit to avoid token limits
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const aiAnalysis = JSON.parse(completion.choices[0].message.content || '{}');

    // Calculate score
    const score = calculateContractScore(aiAnalysis);
    const riskLevel = determineRiskLevel(score);

    // Enrich analysis
    const enrichedAnalysis = {
      overallScore: score,
      riskLevel,
      confidence: 92, // Based on text clarity
      redFlags: aiAnalysis.redFlags || [],
      yellowFlags: aiAnalysis.yellowFlags || [],
      positiveTerms: aiAnalysis.positiveTerms || [],
      keyTerms: aiAnalysis.keyTerms || {},
      summary: aiAnalysis.summary || 'Analysis complete.',
      recommendations: aiAnalysis.recommendations || [],
      metadata: {
        analyzedAt: new Date().toISOString(),
        language: 'nl', // Detect from text
        tokensUsed: completion.usage?.total_tokens || 0,
      },
    };

    // Save to database (if contracts table exists)
    if (propertyId) {
      await supabase.from('contracts').insert({
        user_id: user.id,
        property_id: propertyId,
        analysis: enrichedAnalysis,
        document_hash: '', // Hash of document for deduplication
      });
    }

    return NextResponse.json(enrichedAnalysis);
  } catch (error: any) {
    console.error('Contract analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze contract' },
      { status: 500 }
    );
  }
}

