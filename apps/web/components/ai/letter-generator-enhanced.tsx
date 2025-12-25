'use client';

import { useState } from 'react';
import { X, Sparkles, Globe, FileText, Copy, Download, Mail, RefreshCw, Edit, Check, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/cn';
import type { Property } from '@/types';

interface LetterGeneratorEnhancedProps {
  property: Property;
  onClose: () => void;
  onUse?: (letter: string) => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  // Add more languages...
];

const KEY_POINTS = [
  { id: 'current_situation', label: 'Current living situation' },
  { id: 'employment', label: 'Employment/studies' },
  { id: 'why_property', label: 'Why this property/area' },
  { id: 'pets', label: 'Pet information (if applicable)' },
  { id: 'flexibility', label: 'Move-in flexibility' },
  { id: 'long_term', label: 'Long-term intentions' },
  { id: 'references', label: 'References available' },
];

type Step = 'configure' | 'generating' | 'preview';

export function LetterGeneratorEnhanced({ property, onClose, onUse }: LetterGeneratorEnhancedProps) {
  const [step, setStep] = useState<Step>('configure');
  const [config, setConfig] = useState({
    language: 'en',
    tone: 'professional' as 'professional' | 'friendly' | 'enthusiastic',
    length: 'medium' as 'short' | 'medium' | 'long',
    includePoints: [] as string[],
    additionalInfo: '',
  });
  const [letter, setLetter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [regenerateCount, setRegenerateCount] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setStep('generating');
    setProgressMessage('Analyzing property details...');

    try {
      // Simulate progress
      const progressMessages = [
        'Analyzing property details...',
        'Personalizing your letter...',
        'Crafting the perfect introduction...',
        'Finalizing your application...',
      ];

      for (let i = 0; i < progressMessages.length; i++) {
        setProgressMessage(progressMessages[i]);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      // Call API
      const response = await fetch('/api/ai/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          language: config.language,
          tone: config.tone,
          length: config.length,
          includePoints: config.includePoints,
          additionalInfo: config.additionalInfo || undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate letter');

      const data = await response.json();
      setLetter(data.content);
      setStep('preview');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate letter');
      setStep('configure');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (regenerateCount >= 3) {
      toast.error('Maximum regenerations reached (3 per property)');
      return;
    }
    setRegenerateCount(regenerateCount + 1);
    await handleGenerate();
  };

  const handleCopy = () => {
    if (!letter) return;
    navigator.clipboard.writeText(letter);
    toast.success('Copied to clipboard');
  };

  const handleDownload = () => {
    if (!letter) return;
    const blob = new Blob([letter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `application-letter-${property.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded');
  };

  const wordCount = letter ? letter.split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-900 rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-electric-blue/20">
              <Sparkles className="h-5 w-5 text-electric-blue" />
            </div>
            <div>
              <h2 className="text-h3 font-heading font-bold text-white">AI Application Letter Generator</h2>
              <p className="text-body-sm text-white/60">Create a personalized application letter</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5 text-white/60" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'configure' && (
            <div className="space-y-8">
              {/* Language Selection */}
              <div>
                <label className="text-body-sm font-medium text-white mb-3 block flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Language
                </label>
                <select
                  value={config.language}
                  onChange={(e) => setConfig({ ...config, language: e.target.value })}
                  className="input w-full"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tone Selection */}
              <div>
                <label className="text-body-sm font-medium text-white mb-3 block">Tone</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'professional', label: 'Professional', desc: 'Formal, businesslike' },
                    { id: 'friendly', label: 'Friendly', desc: 'Warm but professional' },
                    { id: 'enthusiastic', label: 'Enthusiastic', desc: 'Shows excitement' },
                  ].map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setConfig({ ...config, tone: tone.id as any })}
                      className={cn(
                        'rounded-lg border-2 p-4 text-left transition-all',
                        config.tone === tone.id
                          ? 'border-electric-blue bg-electric-blue/20'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      )}
                    >
                      <div className="text-body font-semibold text-white mb-1">{tone.label}</div>
                      <div className="text-body-sm text-white/60">{tone.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Length Selection */}
              <div>
                <label className="text-body-sm font-medium text-white mb-3 block">Length</label>
                <div className="flex gap-3">
                  {[
                    { id: 'short', label: 'Short', desc: '150-200 words' },
                    { id: 'medium', label: 'Medium', desc: '250-350 words', default: true },
                    { id: 'long', label: 'Long', desc: '400-500 words' },
                  ].map((length) => (
                    <button
                      key={length.id}
                      onClick={() => setConfig({ ...config, length: length.id as any })}
                      className={cn(
                        'flex-1 rounded-lg border-2 p-4 text-center transition-all',
                        config.length === length.id
                          ? 'border-electric-blue bg-electric-blue/20'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      )}
                    >
                      <div className="text-body font-semibold text-white mb-1">{length.label}</div>
                      <div className="text-body-sm text-white/60">{length.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Points */}
              <div>
                <label className="text-body-sm font-medium text-white mb-3 block">Key Points to Include</label>
                <div className="grid grid-cols-2 gap-3">
                  {KEY_POINTS.map((point) => (
                    <label
                      key={point.id}
                      className={cn(
                        'flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all',
                        config.includePoints.includes(point.id)
                          ? 'border-electric-blue bg-electric-blue/20'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={config.includePoints.includes(point.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setConfig({ ...config, includePoints: [...config.includePoints, point.id] });
                          } else {
                            setConfig({ ...config, includePoints: config.includePoints.filter((p) => p !== point.id) });
                          }
                        }}
                        className="h-4 w-4 rounded border-white/20 text-electric-blue"
                      />
                      <span className="text-body-sm text-white">{point.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <label className="text-body-sm font-medium text-white mb-2 block">
                  Additional Information (Optional)
                </label>
                <textarea
                  value={config.additionalInfo}
                  onChange={(e) => setConfig({ ...config, additionalInfo: e.target.value })}
                  placeholder="Any specific details you'd like to mention?"
                  maxLength={300}
                  rows={4}
                  className="input w-full resize-none"
                />
                <p className="mt-2 text-body-sm text-white/60">
                  {config.additionalInfo.length}/300 characters
                </p>
              </div>
            </div>
          )}

          {step === 'generating' && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative mb-8">
                <div className="h-24 w-24 rounded-full border-4 border-electric-blue/20 border-t-electric-blue animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-electric-blue" />
              </div>
              <p className="text-h4 font-heading font-semibold text-white mb-2">{progressMessage}</p>
              <p className="text-body text-white/60">This may take 5-10 seconds...</p>
            </div>
          )}

          {step === 'preview' && letter && (
            <div className="space-y-6">
              {/* Letter Preview */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-h4 font-heading font-semibold text-white mb-1">Your Application Letter</h3>
                    <div className="flex items-center gap-4 text-body-sm text-white/60">
                      <span>{wordCount} words</span>
                      <span>~{readingTime} min read</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </button>
                    <button
                      onClick={handleDownload}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-body text-white/90 leading-relaxed p-6 bg-white/5 rounded-lg border border-white/10">
                    {letter}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRegenerate}
                  disabled={regenerateCount >= 3}
                  className="btn-secondary flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Regenerate {regenerateCount < 3 && `(${3 - regenerateCount} left)`}
                </button>
                <button
                  onClick={() => {
                    toast.info('Manual editing coming soon');
                  }}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Manually
                </button>
                <button
                  onClick={() => setStep('configure')}
                  className="btn-secondary flex items-center gap-2"
                >
                  Change Settings
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-neutral-900">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            {step === 'configure' && (
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Generate Letter
              </button>
            )}
            {step === 'preview' && letter && (
              <button
                onClick={() => {
                  onUse?.(letter);
                  onClose();
                }}
                className="btn-primary flex items-center gap-2"
              >
                Use This Letter
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

