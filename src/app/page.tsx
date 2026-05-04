import dynamic from "next/dynamic";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";

// Lazy-load below-fold client components to reduce initial JS bundle
const Testimonials = dynamic(() =>
  import("@/components/landing/testimonials").then((m) => ({ default: m.Testimonials }))
);
const FAQ = dynamic(() =>
  import("@/components/landing/faq").then((m) => ({ default: m.FAQ }))
);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <DashboardPreview />
        <Features />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
