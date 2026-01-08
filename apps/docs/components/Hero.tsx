'use client';

import Link from 'next/link';
import { CopyButton } from './CopyButton';

export function Hero() {
  const installCommand = 'npm install @islam-kit/prayer-times';

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(142_71%_45%/0.08)] rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative mx-auto max-w-[980px] px-6 py-20 md:py-28 lg:py-36">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 animate-fade-in">
            <span className="hero-badge">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--primary))] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(var(--primary))]"></span>
              </span>
              Open Source Islamic Utilities
            </span>
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-fade-up">
            Build <span className="text-gradient-accent">Islamic apps</span>,
            <br className="hidden sm:inline" />
            your way.
          </h1>

          {/* Description */}
          <p className="mb-10 max-w-2xl text-lg text-[hsl(var(--muted-foreground))] md:text-xl leading-relaxed animate-fade-up stagger-1">
            Zero-dependency, type-safe utilities for prayer times, Qibla direction, and Quran data. Works everywhere — Node.js, browsers, React, React Native, and Edge runtimes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 animate-fade-up stagger-2">
            <Link href="/docs/getting-started" className="btn-hero-primary">
              Get Started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="https://github.com/asadkomidev/islam-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero-secondary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Open GitHub
            </Link>
          </div>

          {/* Install command */}
          <div className="mt-10 animate-fade-up stagger-3">
            <div className="install-command">
              <div className="flex items-center gap-2">
                <span className="text-[hsl(var(--muted-foreground))]">$</span>
                <code className="text-sm font-mono text-[hsl(var(--foreground))]">
                  {installCommand}
                </code>
              </div>
              <CopyButton text={installCommand} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
