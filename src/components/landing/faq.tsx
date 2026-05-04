"use client";

import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "What platforms does TrendPilot AI support?",
    a: "TrendPilot supports TikTok, Instagram, YouTube Shorts, Facebook, and X (Twitter). Each tool is optimized for platform-specific content formats, tone, and best practices.",
  },
  {
    q: "How does the AI generate content?",
    a: "TrendPilot uses Claude AI — one of the most advanced language models available. You provide your niche, platform, and tone, and the AI generates highly relevant, platform-optimized content based on current trends and best practices.",
  },
  {
    q: "Can I save and export my generated content?",
    a: "Yes! You can save any generated content to your library, view your full history, and export results as TXT or CSV files for use in scheduling tools like Buffer, Later, or Hootsuite.",
  },
  {
    q: "Is there a daily usage limit?",
    a: "During the free testing phase, there are generous daily limits per feature. You can track your usage in the dashboard overview and settings page.",
  },
  {
    q: "Does TrendPilot work for agencies managing multiple clients?",
    a: "Absolutely. The Growth Planner and Viral Ideas Generator are especially powerful for agencies managing multiple accounts. You can generate unique, niche-specific content for each client independently.",
  },
  {
    q: "How accurate are the hashtag suggestions?",
    a: "The hashtag generator produces a mix of trending and niche-specific hashtags relevant to your content, platform, and target audience. It's powered by Claude's up-to-date knowledge of social media trends.",
  },
  {
    q: "Is my data private and secure?",
    a: "Yes. We use enterprise-grade security, Clerk authentication, and encrypted database storage. Your content and personal data are never shared with third parties.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/50 rounded-xl overflow-hidden">
      <button
        className="flex items-center justify-between w-full p-5 text-left hover:bg-muted/30 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-sm sm:text-base pr-4">{q}</span>
        <ChevronDown
          className={cn("h-5 w-5 text-muted-foreground shrink-0 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">
            FAQ
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Got <span className="gradient-text">questions?</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know before getting started.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {FAQS.map(({ q, a }) => (
            <FAQItem key={q} q={q} a={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
