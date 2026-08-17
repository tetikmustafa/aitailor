'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, Github, Linkedin, ExternalLink, Sparkles } from 'lucide-react';

export function AppHeader() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 header-glass border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-lg font-bold tracking-tight text-foreground">
              AiTailor
            </span>
          </div>
          <span className="hidden sm:inline text-xs text-muted-foreground/60">|</span>
          <span className="hidden sm:inline text-sm text-muted-foreground">
            by <span className="font-medium text-foreground/80">Mustafa Tetik</span>
          </span>
        </div>

        {/* Right: Links + Theme Toggle */}
        <div className="flex items-center gap-1">
          <a
            href="https://mustafatetik.com"
            target="_blank"
            rel="noopener noreferrer"
            className="header-icon-btn"
            aria-label="Portfolio"
            title="Portfolio"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href="https://github.com/tetikmustafa"
            target="_blank"
            rel="noopener noreferrer"
            className="header-icon-btn"
            aria-label="GitHub"
            title="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com/in/mustafa-tetik"
            target="_blank"
            rel="noopener noreferrer"
            className="header-icon-btn"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <button
            onClick={toggleTheme}
            className="header-icon-btn"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
