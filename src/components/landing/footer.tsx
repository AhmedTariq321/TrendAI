import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-3">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <span className="gradient-text">TrendPilot AI</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered social media growth tools for creators and businesses who want to grow faster.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a></li>
              <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Tools</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/dashboard/viral-ideas" className="hover:text-foreground transition-colors">Viral Ideas</Link></li>
              <li><Link href="/dashboard/captions" className="hover:text-foreground transition-colors">Caption Generator</Link></li>
              <li><Link href="/dashboard/hooks" className="hover:text-foreground transition-colors">Hook Generator</Link></li>
              <li><Link href="/dashboard/hashtags" className="hover:text-foreground transition-colors">Hashtag Generator</Link></li>
              <li><Link href="/dashboard/planner" className="hover:text-foreground transition-colors">Growth Planner</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Account</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/sign-up" className="hover:text-foreground transition-colors">Sign Up Free</Link></li>
              <li><Link href="/sign-in" className="hover:text-foreground transition-colors">Sign In</Link></li>
              <li><Link href="/dashboard/settings" className="hover:text-foreground transition-colors">Settings</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} TrendPilot AI. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by Claude AI from Anthropic
          </p>
        </div>
      </div>
    </footer>
  );
}
