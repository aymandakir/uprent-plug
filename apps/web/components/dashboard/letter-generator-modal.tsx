"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Copy, Download, Send, Edit2 } from "lucide-react";
import { toast } from "sonner";
import type { Property } from "@rentfusion/database";
import { LetterInputSchema } from "@rentfusion/ai";
import type { z } from "zod";

interface LetterGeneratorModalProps {
  property: Property;
  onClose: () => void;
  onSubmit: (letterId: string) => void;
}

type FormData = z.infer<typeof LetterInputSchema>;

export function LetterGeneratorModal({ property, onClose, onSubmit }: LetterGeneratorModalProps) {
  const [step, setStep] = useState<"form" | "preview">("form");
  const [generatedLetter, setGeneratedLetter] = useState<{ content: string; subject: string } | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormData>({
    resolver: zodResolver(LetterInputSchema),
    defaultValues: {
      propertyTitle: (property as any).title ?? "",
      propertyCity: (property as any).city ?? "",
      propertyType: ((property as any).property_type as any) || "apartment",
      propertyPrice: (property as any).price ?? 0,
      landlordName: (property as any).landlord_name || undefined,
      landlordType: (property as any).landlord_type,
      language: "en",
      tone: "friendly",
      hasPets: false
    }
  });

  const hasPets = watch("hasPets");

  const generateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch("/api/ai/generate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to generate letter");
      return res.json();
    },
    onSuccess: (data) => {
      setGeneratedLetter(data);
      setStep("preview");
      toast.success("Letter generated! 🎉");
    },
    onError: () => {
      toast.error("Failed to generate letter. Please try again.");
    }
  });

  const onGenerate = (data: FormData) => {
    generateMutation.mutate(data);
  };

  const handleCopy = () => {
    if (!generatedLetter) return;
    navigator.clipboard.writeText(generatedLetter.content);
    toast.success("Letter copied to clipboard!");
  };

  const handleDownload = () => {
    if (!generatedLetter) return;
    const blob = new Blob([generatedLetter.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `application-${(property as any).city || "rentfusion"}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Letter downloaded!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="bg-gradient-to-r from-brand-400 to-accent-400 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6" />
              <h2 className="text-2xl font-bold">AI Application Letter</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 transition-colors hover:bg-white/20"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <p className="mt-2 text-white/90">
            Generate a personalized letter for: <strong>{(property as any).title}</strong>
          </p>
        </div>

        <div className="max-h-[calc(90vh-160px)] overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === "form" ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmit(onGenerate)}
                className="space-y-6 p-6"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Full Name *</label>
                    <input
                      {...register("fullName")}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-400"
                      placeholder="John Doe"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Age (optional)</label>
                    <input
                      {...register("age", { valueAsNumber: true })}
                      type="number"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-400"
                      placeholder="28"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Occupation *</label>
                    <input
                      {...register("occupation")}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-400"
                      placeholder="Software Engineer"
                    />
                    {errors.occupation && (
                      <p className="mt-1 text-sm text-red-500">{errors.occupation.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Monthly Income (€) *
                    </label>
                    <input
                      {...register("monthlyIncome", { valueAsNumber: true })}
                      type="number"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-400"
                      placeholder="3500"
                    />
                    {errors.monthlyIncome && (
                      <p className="mt-1 text-sm text-red-500">{errors.monthlyIncome.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Current Location *
                    </label>
                    <input
                      {...register("currentLocation")}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-400"
                      placeholder="Rotterdam"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Language *</label>
                    <select
                      {...register("language")}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-400"
                    >
                      <option value="en">English</option>
                      <option value="nl">Dutch (Nederlands)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Why are you moving? *
                  </label>
                  <textarea
                    {...register("moveReason")}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-400"
                    placeholder="Starting a new job in Amsterdam..."
                  />
                  {errors.moveReason && (
                    <p className="mt-1 text-sm text-red-500">{errors.moveReason.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Hobbies (optional, comma-separated)
                  </label>
                  <input
                    {...register("hobbies")}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-400"
                    placeholder="cycling, reading, cooking"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    {...register("hasPets")}
                    type="checkbox"
                    id="hasPets"
                    className="h-5 w-5 rounded border-gray-300 text-brand-400 focus:ring-brand-400"
                  />
                  <label htmlFor="hasPets" className="text-sm font-medium text-gray-700">
                    I have pets
                  </label>
                </div>

                {hasPets && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Describe your pet(s)
                    </label>
                    <input
                      {...register("petDescription")}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-400"
                      placeholder="Small dog, well-trained"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Letter Tone</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["professional", "friendly", "formal"] as const).map((tone) => (
                      <label key={tone} className="relative flex cursor-pointer items-center justify-center">
                        <input {...register("tone")} type="radio" value={tone} className="peer sr-only" />
                        <div className="w-full rounded-lg border-2 border-gray-300 py-3 text-center font-medium capitalize transition-all peer-checked:border-brand-400 peer-checked:bg-brand-50">
                          {tone}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Special requests (optional)
                  </label>
                  <textarea
                    {...register("customPrompt")}
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-400"
                    placeholder="Mention my previous experience living in student housing..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={generateMutation.isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-400 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate Letter with AI
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 p-6"
              >
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setStep("form")}
                    className="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
                  >
                    ← Back to Form
                  </button>
                  <button
                    onClick={() => setIsEditing((s) => !s)}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
                  >
                    <Edit2 className="h-4 w-4" />
                    {isEditing ? "Done Editing" : "Edit"}
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>

                {generatedLetter && (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Subject</label>
                      <div className="rounded-lg bg-gray-50 px-4 py-3 font-medium">
                        {generatedLetter.subject}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Letter</label>
                      {isEditing ? (
                        <textarea
                          value={generatedLetter.content}
                          onChange={(e) =>
                            setGeneratedLetter({ ...generatedLetter, content: e.target.value })
                          }
                          rows={15}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm leading-relaxed focus:border-transparent focus:ring-2 focus:ring-brand-400"
                        />
                      ) : (
                        <div className="whitespace-pre-wrap rounded-lg bg-gray-50 px-4 py-3 text-sm leading-relaxed">
                          {generatedLetter.content}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => onSubmit("letter-id")}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-400 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-500"
                >
                  <Send className="h-5 w-5" />
                  Send Application
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

