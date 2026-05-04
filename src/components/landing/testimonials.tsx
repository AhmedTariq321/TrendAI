import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "TikTok Creator, 280K followers",
    content: "TrendPilot completely changed my content game. I went from struggling to post twice a week to publishing daily with banging hooks every time. My views doubled in 3 weeks.",
    avatar: "SC",
    rating: 5,
    platform: "TikTok",
  },
  {
    name: "Marcus Johnson",
    role: "Instagram Coach",
    content: "The caption generator alone is worth everything. It understands tone, platform nuance, and always adds that perfect CTA. My engagement rate jumped from 2% to 7%.",
    avatar: "MJ",
    rating: 5,
    platform: "Instagram",
  },
  {
    name: "Priya Sharma",
    role: "YouTube Shorts Creator",
    content: "I use the Growth Planner every month. Having a full 30-day strategy ready in minutes is insane. I never run out of ideas anymore.",
    avatar: "PS",
    rating: 5,
    platform: "YouTube",
  },
  {
    name: "Alejandro Ruiz",
    role: "Social Media Manager",
    content: "Managing 5 client accounts used to take my whole week. Now I generate a month of content in a single afternoon. TrendPilot is a no-brainer for agencies.",
    avatar: "AR",
    rating: 5,
    platform: "Multiple",
  },
  {
    name: "Emma Williams",
    role: "E-commerce Brand Owner",
    content: "Our Facebook and Instagram engagement skyrocketed after we started using AI-generated hooks. The hashtag tool is also incredibly accurate for our niche.",
    avatar: "EW",
    rating: 5,
    platform: "Facebook",
  },
  {
    name: "Daniel Park",
    role: "X / Twitter Influencer",
    content: "The viral idea generator gives me angles I'd never think of myself. Every week I have 30 fresh concepts to work through. Absolutely essential for consistency.",
    avatar: "DP",
    rating: 5,
    platform: "X (Twitter)",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">
            Testimonials
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Loved by <span className="gradient-text">creators worldwide</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of creators already growing faster with TrendPilot AI.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="p-6 rounded-2xl border border-border/50 bg-card/50 flex flex-col gap-4 card-hover"
            >
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground flex-1">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
                <Badge variant="outline" className="ml-auto text-xs">
                  {t.platform}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
