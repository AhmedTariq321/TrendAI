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
  { id: "realistic", label: "Realistic", prompt: "photorealistic, ultra detailed, 8k photography" },
  { id: "anime", label: "Anime", prompt: "anime style, vibrant colors, studio ghibli inspired" },
  { id: "artistic", label: "Artistic", prompt: "digital art, concept art, detailed illustration" },
  { id: "cinematic", label: "Cinematic", prompt: "cinematic shot, movie still, dramatic lighting, film grain" },
  { id: "watercolor", label: "Watercolor", prompt: "watercolor painting, soft brushstrokes, artistic" },
  { id: "3d", label: "3D Render", prompt: "3d render, octane render, subsurface scattering, detailed" },
];

const RATIOS = [
  { id: "square",    label: "1:1",   w: 1024, h: 1024 },
  { id: "landscape", label: "16:9",  w: 1280, h: 720  },
  { id: "portrait",  label: "9:16",  w: 720,  h: 1280 },
  { id: "wide",      label: "4:3",   w: 1024, h: 768  },
];

const SUGGESTIONS = [
  "A futuristic city at sunset with flying cars",
  "A cozy coffee shop in the rain at night",
  "An astronaut floating in a colorful nebula",
  "A magical forest with glowing mushrooms",
  "A minimalist workspace with plants",
  "A dragon soaring over snowy mountains",
];

type ImageStatus = "loading" | "done" | "error";

interface GeneratedImage {
  id: string;
  dataUrl: string | null;
  prompt: string;
  styleId: string;
  ratioId: string;
  status: ImageStatus;
}

export default function ImageGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("realistic");
  const [selectedRatio, setSelectedRatio] = useState("square");
  const [generating, setGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [lightbox, setLightbox] = useState<GeneratedImage | null>(null);

  const fetchOne = useCallback(async (
    id: string, fullPrompt: string, styleId: string, ratioId: string,
    ratio: { w: number; h: number }, delay = 0
  ) => {
    try {
      const res = await fetch("/api/image-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt, width: ratio.w, height: ratio.h, delay }),
      });
      const data = await res.json();
      if (!res.ok || !data.dataUrl) throw new Error(data.error ?? "Failed");
      setImages((prev) =>
        prev.map((img) => img.id === id ? { ...img, dataUrl: data.dataUrl, status: "done" } : img)
      );
    } catch {
      setImages((prev) =>
        prev.map((img) => img.id === id ? { ...img, status: "error" } : img)
      );
    }
  }, []);

  const generate = async (overridePrompt?: string, overrideStyle?: string, overrideRatio?: string) => {
    const p = (overridePrompt ?? prompt).trim();
    const styleId = overrideStyle ?? selectedStyle;
    const ratioId = overrideRatio ?? selectedRatio;

    if (!p) { toast.error("Enter a prompt first"); return; }

    const style = STYLES.find((s) => s.id === styleId)!;
    const ratio = RATIOS.find((r) => r.id === ratioId)!;
    const fullPrompt = `${p}, ${style.prompt}`;

    setGenerating(true);

    // Add 2 placeholder cards immediately
    const placeholders: GeneratedImage[] = [0, 1].map((i) => ({
      id: `${Date.now()}-${i}`,
      dataUrl: null,
      prompt: p,
      styleId,
      ratioId,
      status: "loading",
    }));

    setImages((prev) => [...placeholders, ...prev]);

    // Fetch both in parallel — stagger by 3s so Pollinations doesn't rate-limit
    await Promise.all(
      placeholders.map((ph, i) => fetchOne(ph.id, fullPrompt, styleId, ratioId, ratio, i * 3000))
    );

    setGenerating(false);
    toast.success("Images ready!");
  };

  const regenOne = async (img: GeneratedImage) => {
    const style = STYLES.find((s) => s.id === img.styleId)!;
    const ratio = RATIOS.find((r) => r.id === img.ratioId)!;
    const fullPrompt = `${img.prompt}, ${style.prompt}`;
    const newId = `${Date.now()}-regen`;

    const placeholder: GeneratedImage = {
      id: newId, dataUrl: null, prompt: img.prompt,
      styleId: img.styleId, ratioId: img.ratioId, status: "loading",
    };
    setImages((prev) => [placeholder, ...prev]);
    await fetchOne(newId, fullPrompt, img.styleId, img.ratioId, ratio);
  };

  const downloadImage = (img: GeneratedImage) => {
    if (!img.dataUrl) return;
    const link = document.createElement("a");
    link.href = img.dataUrl;
    link.download = `trendpilot-${img.id}.jpg`;
    link.click();
    toast.success("Image downloaded!");
  };

  const aspectClass = (ratioId: string) => ({
    portrait:  "aspect-[9/16]",
    landscape: "aspect-[16/9]",
    wide:      "aspect-[4/3]",
    square:    "aspect-square",
  }[ratioId] ?? "aspect-square");

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

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* ── Left: controls ── */}
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
                onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generate(); }}
                placeholder="A breathtaking sunset over a futuristic city skyline..."
                rows={3}
                className="w-full resize-none rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500/40 transition-all"
              />
              <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground/40">
                Ctrl+↵ generate
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

          {/* Generate */}
          <Button
            onClick={() => generate()}
            disabled={generating || !prompt.trim()}
            className="w-full h-12 text-sm font-bold gap-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white border-0 shadow-lg shadow-pink-500/25 disabled:opacity-50"
          >
            {generating ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
            ) : (
              <><Wand2 className="h-4 w-4" /> Generate Images</>
            )}
          </Button>
        </div>

        {/* ── Right: output ── */}
        <div className="space-y-4">
          {images.length === 0 ? (
            <Card className="border-dashed border-border/40 bg-card/20 flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
              <div className="p-4 rounded-2xl bg-pink-500/10">
                <Sparkles className="h-8 w-8 text-pink-400" />
              </div>
              <div>
                <p className="font-semibold mb-1">Your images will appear here</p>
                <p className="text-sm text-muted-foreground">Enter a prompt and hit Generate</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Takes ~15–30 seconds per image</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {images.length} image{images.length !== 1 ? "s" : ""}
                </p>
                <Button
                  variant="ghost" size="sm"
                  className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
                  onClick={() => setImages([])}
                >
                  <X className="h-3 w-3" /> Clear all
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className={cn(
                      "group relative rounded-xl overflow-hidden border bg-muted/20",
                      img.status === "done" ? "border-border/40" : "border-border/20"
                    )}
                  >
                    <div className={cn("w-full", aspectClass(img.ratioId))}>
                      {img.status === "loading" && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/30">
                          <Loader2 className="h-6 w-6 animate-spin text-pink-400" />
                          <p className="text-[10px] text-muted-foreground">Generating...</p>
                        </div>
                      )}
                      {img.status === "error" && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                          <p className="text-[11px] text-muted-foreground">Generation failed</p>
                          <button
                            onClick={() => regenOne(img)}
                            className="text-[11px] text-pink-400 hover:underline"
                          >
                            Try again
                          </button>
                        </div>
                      )}
                      {img.status === "done" && img.dataUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={img.dataUrl}
                          alt={img.prompt}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Hover overlay */}
                    {img.status === "done" && (
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
                          onClick={() => regenOne(img)}
                          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
                          title="New variation"
                        >
                          <RefreshCw className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox?.dataUrl && (
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
            <img src={lightbox.dataUrl} alt={lightbox.prompt} className="w-full rounded-2xl shadow-2xl" />
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
