"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ImageIcon, Wand2, Download, RefreshCw, Loader2,
  Sparkles, X, ZoomIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STYLES = [
  { id: "realistic", label: "Realistic", prompt: "photorealistic, high detail, 8k" },
  { id: "anime", label: "Anime", prompt: "anime style, studio ghibli, vibrant colors" },
  { id: "artistic", label: "Artistic", prompt: "digital art, concept art, artstation" },
  { id: "cinematic", label: "Cinematic", prompt: "cinematic, movie still, dramatic lighting" },
  { id: "watercolor", label: "Watercolor", prompt: "watercolor painting, soft colors, artistic" },
  { id: "3d", label: "3D Render", prompt: "3d render, blender, octane render, detailed" },
];

const RATIOS = [
  { id: "square", label: "1:1", w: 1024, h: 1024 },
  { id: "landscape", label: "16:9", w: 1280, h: 720 },
  { id: "portrait", label: "9:16", w: 720, h: 1280 },
  { id: "wide", label: "4:3", w: 1024, h: 768 },
];

const SUGGESTIONS = [
  "A futuristic city at sunset with flying cars",
  "A cozy coffee shop in the rain at night",
  "An astronaut floating in a colorful nebula",
  "A magical forest with glowing mushrooms",
  "A minimalist workspace with plants and good lighting",
  "A dragon soaring over snowy mountains",
];

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: string;
}

export default function ImageGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("realistic");
  const [selectedRatio, setSelectedRatio] = useState("square");
  const [generating, setGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [lightbox, setLightbox] = useState<GeneratedImage | null>(null);

  const buildUrl = useCallback((userPrompt: string, styleId: string, ratioId: string) => {
    const style = STYLES.find((s) => s.id === styleId)!;
    const ratio = RATIOS.find((r) => r.id === ratioId)!;
    const fullPrompt = `${userPrompt}, ${style.prompt}`;
    const encoded = encodeURIComponent(fullPrompt);
    const seed = Math.floor(Math.random() * 999999);
    return `https://image.pollinations.ai/prompt/${encoded}?width=${ratio.w}&height=${ratio.h}&nologo=true&seed=${seed}&model=flux`;
  }, []);

  const generate = async () => {
    if (!prompt.trim()) {
      toast.error("Enter a prompt first");
      return;
    }
    setGenerating(true);
    try {
      // Generate 2 variations
      const newImages: GeneratedImage[] = [1, 2].map((_, i) => ({
        id: `${Date.now()}-${i}`,
        url: buildUrl(prompt, selectedStyle, selectedRatio),
        prompt,
        style: selectedStyle,
      }));
      setImages((prev) => [...newImages, ...prev]);
      toast.success("Images generated!", { description: "Loading may take a few seconds." });
    } finally {
      setGenerating(false);
    }
  };

  const downloadImage = async (img: GeneratedImage) => {
    try {
      const res = await fetch(img.url);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `trendpilot-${img.id}.jpg`;
      link.click();
      toast.success("Image downloaded!");
    } catch {
      toast.error("Download failed — try right-clicking the image instead.");
    }
  };

  const ratio = RATIOS.find((r) => r.id === selectedRatio)!;
  const aspectClass =
    selectedRatio === "portrait" ? "aspect-[9/16]" :
    selectedRatio === "landscape" ? "aspect-[16/9]" :
    selectedRatio === "wide" ? "aspect-[4/3]" : "aspect-square";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-pink-500/15">
          <ImageIcon className="h-5 w-5 text-pink-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold">AI Image Generation</h1>
          <p className="text-sm text-muted-foreground">Turn your ideas into stunning visuals instantly</p>
        </div>
        <Badge variant="outline" className="ml-auto text-xs border-pink-500/30 bg-pink-500/10 text-pink-300">
          Powered by Flux
        </Badge>
      </div>

      {/* Main panel */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-6">

        {/* Left: controls */}
        <div className="space-y-5">
          {/* Prompt */}
          <Card className="p-5 border-border/50 bg-card/40">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Describe your image
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) generate(); }}
                placeholder="A breathtaking sunset over a futuristic city skyline..."
                rows={3}
                className="w-full resize-none rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500/40 transition-all"
              />
              <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground/50">
                ⌘↵ to generate
              </div>
            </div>

            {/* Suggestions */}
            <div className="mt-3">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Try these</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setPrompt(s)}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-border/50 bg-background/50 text-muted-foreground hover:text-foreground hover:border-pink-500/40 hover:bg-pink-500/5 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Style */}
          <Card className="p-5 border-border/50 bg-card/40">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Art style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={cn(
                    "px-3 py-2 rounded-xl text-xs font-semibold border transition-all",
                    selectedStyle === style.id
                      ? "bg-pink-500/15 border-pink-500/40 text-pink-300"
                      : "border-border/50 text-muted-foreground hover:border-pink-500/25 hover:text-foreground"
                  )}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Aspect ratio */}
          <Card className="p-5 border-border/50 bg-card/40">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Aspect ratio
            </label>
            <div className="flex gap-2">
              {RATIOS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRatio(r.id)}
                  className={cn(
                    "flex-1 py-2 rounded-xl text-xs font-semibold border transition-all",
                    selectedRatio === r.id
                      ? "bg-pink-500/15 border-pink-500/40 text-pink-300"
                      : "border-border/50 text-muted-foreground hover:border-pink-500/25 hover:text-foreground"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Generate button */}
          <Button
            onClick={generate}
            disabled={generating || !prompt.trim()}
            className="w-full h-12 text-sm font-bold gap-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white border-0 shadow-lg shadow-pink-500/25 disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                Generate Images
              </>
            )}
          </Button>
        </div>

        {/* Right: preview / output */}
        <div className="space-y-4">
          {images.length === 0 ? (
            <Card className="border-dashed border-border/40 bg-card/20 flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
              <div className="p-4 rounded-2xl bg-pink-500/10">
                <Sparkles className="h-8 w-8 text-pink-400" />
              </div>
              <div>
                <p className="font-semibold mb-1">Your images will appear here</p>
                <p className="text-sm text-muted-foreground">Enter a prompt and hit Generate</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {images.length} image{images.length !== 1 ? "s" : ""} generated
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
                  onClick={() => setImages([])}
                >
                  <X className="h-3 w-3" /> Clear all
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {images.map((img) => (
                  <div key={img.id} className="group relative rounded-xl overflow-hidden border border-border/40 bg-muted/20">
                    <div className={cn("w-full", aspectClass)}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.prompt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23111'/%3E%3Ctext x='50%25' y='50%25' fill='%23555' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='14'%3EFailed to load%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    {/* overlay actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => setLightbox(img)}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
                        title="View full size"
                      >
                        <ZoomIn className="h-4 w-4 text-white" />
                      </button>
                      <button
                        onClick={() => downloadImage(img)}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
                        title="Download"
                      >
                        <Download className="h-4 w-4 text-white" />
                      </button>
                      <button
                        onClick={() => {
                          const regen: GeneratedImage = {
                            id: `${Date.now()}-regen`,
                            url: buildUrl(img.prompt, img.style, selectedRatio),
                            prompt: img.prompt,
                            style: img.style,
                          };
                          setImages((prev) => [regen, ...prev]);
                        }}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
                        title="Regenerate variation"
                      >
                        <RefreshCw className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4 text-white" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.url}
              alt={lightbox.prompt}
              className="w-full rounded-2xl shadow-2xl"
            />
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-white/70 truncate flex-1 mr-4">{lightbox.prompt}</p>
              <Button
                size="sm"
                onClick={() => downloadImage(lightbox)}
                className="h-8 gap-1.5 bg-white/10 hover:bg-white/20 text-white border-0 text-xs"
              >
                <Download className="h-3.5 w-3.5" /> Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
