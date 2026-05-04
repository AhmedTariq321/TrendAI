"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Show, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Moon, Sun, Zap, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? "bg-background/90 backdrop-blur-md border-b border-border/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl shrink-0">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <span className="gradient-text">TrendPilot AI</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Desktop auth — hidden on small screens */}
            <div className="hidden sm:flex items-center gap-2">
              <Show when="signed-out">
                <ButtonLink variant="ghost" size="sm" href="/sign-in">Sign In</ButtonLink>
                <ButtonLink size="sm" href="/sign-up" className="bg-primary hover:bg-primary/90">
                  Get Started Free
                </ButtonLink>
              </Show>
              <Show when="signed-in">
                <ButtonLink size="sm" variant="outline" href="/dashboard">Dashboard</ButtonLink>
                <UserButton />
              </Show>
            </div>

            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border/40 py-3 space-y-1">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors"
              >
                {label}
              </a>
            ))}
            <div className="flex gap-2 pt-3 border-t border-border/30 mt-1">
              <Show when="signed-out">
                <ButtonLink variant="outline" size="sm" href="/sign-in" className="flex-1 justify-center">
                  Sign In
                </ButtonLink>
                <ButtonLink size="sm" href="/sign-up" className="flex-1 justify-center bg-primary hover:bg-primary/90">
                  Get Started
                </ButtonLink>
              </Show>
              <Show when="signed-in">
                <ButtonLink size="sm" variant="outline" href="/dashboard" className="flex-1 justify-center">
                  Dashboard
                </ButtonLink>
              </Show>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
