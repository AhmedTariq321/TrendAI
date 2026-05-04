import { Badge } from "@/components/ui/badge";
import {
  Lightbulb, Sparkles, Zap, Hash, BookOpen, BarChart3,
  Copy, Download, BookmarkPlus, Clock, Shield, Globe,
} from "lucide-react";

const MAIN_FEATURES = [
  {
    icon: Lightbulb,
    title: "Viral Idea Generator",
    description: "Get 30 trending content ideas tailored to your niche, platform, and audience in seconds.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    tags: ["30 ideas", "Per platform"],
  },
  {
    icon: Sparkles,
    title: "Caption Generator",
    description: "Generate 10 high-converting captions with CTAs, emojis, and platform-specific formatting.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    tags: ["10 variants", "CTA included"],
  },
  {
    icon: Zap,
    title: "Hook Generator",
    description: "Create powerful opening lines that stop the scroll and make viewers want more.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    tags: ["High CTR", "Scroll-stopping"],
  },
  {
    icon: Hash,
    title: "Hashtag Generator",
    description: "Get trending and niche-specific hashtags that maximize your reach and discoverability.",
    color: "text-green-500",
    bg: "bg-green-500/10",
    tags: ["Trending", "Niche specific"],
  },
  {
    icon: BookOpen,
    title: "Growth Planner",
    description: "Generate complete 7-day or 30-day content calendars with post types, timing, and strategies.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    tags: ["7-day plan", "30-day plan"],
  },
  {
    icon: BarChart3,
    title: "Growth Analytics",
    description: "Track your AI usage, saved content, and generation history to optimize your workflow.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    tags: ["Usage stats", "History"],
  },
];

const EXTRA_FEATURES = [
  { icon: Copy, text: "One-click copy" },
  { icon: Download, text: "Export TXT/CSV" },
  { icon: BookmarkPlus, text: "Save favorites" },
  { icon: Clock, text: "Full history" },
  { icon: Shield, text: "Secure & private" },
  { icon: Globe, text: "Multi-language" },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">
            Core Features
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Everything you need to go <span className="gradient-text">viral</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Five powerful AI tools built specifically for creators who want to grow faster without spending hours on content.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {MAIN_FEATURES.map(({ icon: Icon, title, description, color, bg, tags }) => (
            <div
              key={title}
              className="p-6 rounded-2xl border border-border/50 bg-card/50 card-hover group"
            >
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{description}</p>
              <div className="flex gap-2">
                {tags.map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Extra features strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {EXTRA_FEATURES.map(({ icon: Icon, text }) => (
            <div key={text} className="flex flex-col items-center gap-2 p-4 rounded-xl glass text-center">
              <Icon className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
