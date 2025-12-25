'use client';

import { useState } from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle, X, Download, Mail, Share2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/cn';

interface ContractAnalyzerProps {
  propertyId?: string;
  onClose?: () => void;
}

interface ContractIssue {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  location: string;
  quote: string;
  legalReference?: string;
  recommendation: string;
}

interface ContractAnalysis {
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  redFlags: ContractIssue[];
  yellowFlags: ContractIssue[];
  positiveTerms: any[];
  keyTerms: any[];
  summary: string;
  recommendations: string[];
}

export function ContractAnalyzer({ propertyId, onClose }: ContractAnalyzerProps) {
  const [step, setStep] = useState<'upload' | 'processing' | 'results'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'red' | 'yellow' | 'positive'>('red');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      if (uploadedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10 MB');
        return;
      }
      setFile(uploadedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file && !text.trim()) {
      toast.error('Please upload a file or paste contract text');
      return;
    }

    setLoading(true);
    setStep('processing');
    setProgress(0);

    try {
      const progressStages = [
        { message: 'Extracting text from document...', progress: 20 },
        { message: 'Identifying contract clauses...', progress: 40 },
        { message: 'Analyzing terms and conditions...', progress: 70 },
        { message: 'Checking for red flags...', progress: 90 },
        { message: 'Generating summary...', progress: 100 },
      ];

      for (const stage of progressStages) {
        setProgressMessage(stage.message);
        setProgress(stage.progress);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      // Call API
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      if (text) {
        formData.append('text', text);
      }
      if (propertyId) {
        formData.append('propertyId', propertyId);
      }

      const response = await fetch('/api/ai/analyze-contract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to analyze contract');

      const data = await response.json();
      setAnalysis(data);
      setStep('results');
    } catch (error: any) {
      toast.error(error.message || 'Failed to analyze contract');
      setStep('upload');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-500/20 text-green-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'high':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-neutral-900 rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <FileText className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-h3 font-heading font-bold text-white">AI Contract Analyzer</h2>
              <p className="text-body-sm text-white/60">Premium feature - Analyze rental contracts</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5 text-white/60" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'upload' && (
            <div className="space-y-6">
              {/* Upload Zone */}
              <div>
                <label className="text-body-sm font-medium text-white mb-3 block">Upload Contract Document</label>
                <div
                  className={cn(
                    'border-2 border-dashed rounded-lg p-12 text-center transition-colors',
                    file ? 'border-electric-blue bg-electric-blue/10' : 'border-white/20 bg-white/5 hover:border-white/40'
                  )}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="contract-upload"
                  />
                  <label htmlFor="contract-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-white/40 mx-auto mb-4" />
                    <p className="text-body font-medium text-white mb-2">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-body-sm text-white/60">
                      PDF, DOC, DOCX (Max 10 MB)
                    </p>
                  </label>
                </div>
              </div>

              {/* Or Paste Text */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-body-sm">
                  <span className="bg-neutral-900 px-4 text-white/60">OR</span>
                </div>
              </div>

              <div>
                <label className="text-body-sm font-medium text-white mb-3 block">Paste Contract Text</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste contract text here..."
                  rows={10}
                  maxLength={50000}
                  className="input w-full resize-none font-mono text-sm"
                />
                <p className="mt-2 text-body-sm text-white/60">
                  {text.length.toLocaleString()}/50,000 characters
                </p>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative mb-8">
                <div className="h-32 w-32 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-purple-400" />
              </div>
              <p className="text-h4 font-heading font-semibold text-white mb-2">{progressMessage}</p>
              <div className="w-full max-w-md bg-white/10 rounded-full h-2 mb-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-body text-white/60">
                {progress < 100 ? `~${Math.ceil((100 - progress) / 10)} seconds remaining` : 'Almost done...'}
              </p>
            </div>
          )}

          {step === 'results' && analysis && (
            <div className="space-y-6">
              {/* Overall Score Card */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-h3 font-heading font-bold text-white mb-2">Overall Safety Score</h3>
                    <div className={cn('text-h1 font-heading font-bold', getScoreColor(analysis.overallScore))}>
                      {analysis.overallScore}/100
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      'inline-block rounded-full px-4 py-2 text-body-sm font-medium mb-2',
                      getRiskLevelColor(analysis.riskLevel)
                    )}>
                      {analysis.riskLevel.toUpperCase()} RISK
                    </div>
                    <p className="text-body-sm text-white/60">
                      Confidence: {analysis.confidence}%
                    </p>
                  </div>
                </div>

                {/* Circular Progress Indicator */}
                <div className="flex justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-white/10"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - analysis.overallScore / 100)}`}
                        className={getScoreColor(analysis.overallScore)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={cn('text-h2 font-heading font-bold', getScoreColor(analysis.overallScore))}>
                        {analysis.overallScore}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Issues Found */}
              <div className="card">
                <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                  {[
                    { id: 'red', label: 'Red Flags', count: analysis.redFlags.length, icon: AlertTriangle },
                    { id: 'yellow', label: 'Yellow Flags', count: analysis.yellowFlags.length, icon: AlertTriangle },
                    { id: 'positive', label: 'Good Terms', count: analysis.positiveTerms.length, icon: CheckCircle },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                          'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                          activeTab === tab.id
                            ? 'bg-white/10 text-white'
                            : 'text-white/60 hover:text-white/80'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                        {tab.count > 0 && (
                          <span className="rounded-full bg-electric-blue px-2 py-0.5 text-caption text-white">
                            {tab.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Issues List */}
                <div className="space-y-4">
                  {(activeTab === 'red' ? analysis.redFlags : activeTab === 'yellow' ? analysis.yellowFlags : analysis.positiveTerms).map((issue: any) => (
                    <div
                      key={issue.id}
                      className={cn(
                        'rounded-lg border p-4',
                        issue.severity === 'high' ? 'border-red-500/50 bg-red-500/10' :
                        issue.severity === 'medium' ? 'border-yellow-500/50 bg-yellow-500/10' :
                        'border-green-500/50 bg-green-500/10'
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-body font-semibold text-white">{issue.title}</h4>
                        {issue.severity && (
                          <span className={cn(
                            'rounded-full px-2 py-0.5 text-caption font-medium',
                            issue.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                            issue.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          )}>
                            {issue.severity.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <p className="text-body-sm text-white/70 mb-2">{issue.description}</p>
                      {issue.location && (
                        <p className="text-body-sm text-white/60 mb-2">Location: {issue.location}</p>
                      )}
                      {issue.quote && (
                        <div className="bg-black/50 rounded p-3 mb-2">
                          <p className="text-body-sm text-white/80 font-mono">"{issue.quote}"</p>
                        </div>
                      )}
                      {issue.recommendation && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <p className="text-body-sm font-medium text-white mb-1">Recommendation:</p>
                          <p className="text-body-sm text-white/70">{issue.recommendation}</p>
                        </div>
                      )}
                      {issue.legalReference && (
                        <p className="text-body-sm text-white/60 mt-2">
                          Legal reference: {issue.legalReference}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="card">
                <h3 className="text-h4 font-heading font-semibold text-white mb-4">AI Explanation</h3>
                <p className="text-body text-white/80 leading-relaxed whitespace-pre-wrap">
                  {analysis.summary}
                </p>
              </div>

              {/* Action Center */}
              <div className="card">
                <h3 className="text-h4 font-heading font-semibold text-white mb-4">Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button className="btn-secondary flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" />
                    Download Report
                  </button>
                  <button className="btn-secondary flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Landlord
                  </button>
                  <button className="btn-secondary flex items-center justify-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                  <button className="btn-secondary flex items-center justify-center gap-2">
                    <FileText className="h-4 w-4" />
                    Save Analysis
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'upload' && (
          <div className="p-6 border-t border-white/10 bg-neutral-900">
            <div className="flex items-center justify-end gap-3">
              {onClose && (
                <button onClick={onClose} className="btn-secondary">
                  Cancel
                </button>
              )}
              <button
                onClick={handleAnalyze}
                disabled={loading || (!file && !text.trim())}
                className="btn-primary flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Analyze Contract
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

