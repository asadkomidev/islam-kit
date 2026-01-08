import type { ReactNode } from 'react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'tip' | 'error' | 'note';
  title?: string;
  children: ReactNode;
}

const styles = {
  info: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/10',
    border: 'border-l-blue-500',
    icon: 'text-blue-500',
  },
  warning: {
    bg: 'bg-yellow-500/10 dark:bg-yellow-500/10',
    border: 'border-l-yellow-500',
    icon: 'text-yellow-500',
  },
  tip: {
    bg: 'bg-green-500/10 dark:bg-green-500/10',
    border: 'border-l-green-500',
    icon: 'text-green-500',
  },
  error: {
    bg: 'bg-red-500/10 dark:bg-red-500/10',
    border: 'border-l-red-500',
    icon: 'text-red-500',
  },
  note: {
    bg: 'bg-purple-500/10 dark:bg-purple-500/10',
    border: 'border-l-purple-500',
    icon: 'text-purple-500',
  },
};

const icons = {
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  ),
  warning: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  ),
  tip: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  ),
  note: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
};

const defaultTitles = {
  info: 'Info',
  warning: 'Warning',
  tip: 'Tip',
  error: 'Error',
  note: 'Note',
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const style = styles[type];
  const displayTitle = title ?? defaultTitles[type];

  return (
    <div className={`my-4 flex gap-3 rounded-lg border-l-4 p-4 ${style.bg} ${style.border}`}>
      <div className={`mt-0.5 flex-shrink-0 ${style.icon}`}>{icons[type]}</div>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-sm font-semibold text-[hsl(var(--foreground))]">{displayTitle}</p>
        <div className="text-sm text-[hsl(var(--muted-foreground))] [&>p]:m-0">{children}</div>
      </div>
    </div>
  );
}
