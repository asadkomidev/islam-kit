'use client';

import { useState } from 'react';

interface InstallTabsProps {
  packageName: string;
}

type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

const packageManagers: PackageManager[] = ['npm', 'pnpm', 'yarn', 'bun'];

const getCommand = (pm: PackageManager, pkg: string): string => {
  const commands = {
    npm: `npm install ${pkg}`,
    pnpm: `pnpm add ${pkg}`,
    yarn: `yarn add ${pkg}`,
    bun: `bun add ${pkg}`,
  };
  return commands[pm];
};

export function InstallTabs({ packageName }: InstallTabsProps) {
  const [activeTab, setActiveTab] = useState<PackageManager>('npm');
  const [copied, setCopied] = useState(false);
  const command = getCommand(activeTab, packageName);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-fd-border bg-fd-card">
      {/* Tabs row */}
      <div className="flex border-b border-fd-border bg-fd-muted/50">
        {packageManagers.map((pm) => (
          <button
            key={pm}
            onClick={() => setActiveTab(pm)}
            type="button"
            className={`px-4 py-2 text-sm font-medium border-none cursor-pointer transition-colors ${
              activeTab === pm
                ? 'bg-fd-background text-fd-foreground'
                : 'bg-transparent text-fd-muted-foreground hover:text-fd-foreground'
            }`}
          >
            {pm}
          </button>
        ))}
      </div>

      {/* Command row */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-fd-secondary">
        <code className="text-sm font-mono text-fd-foreground">
          {command}
        </code>
        <button
          onClick={handleCopy}
          type="button"
          className="p-1.5 rounded text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent transition-colors"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
