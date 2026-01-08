import Link from 'next/link';
import type { ReactNode } from 'react';

interface PackageCardProps {
  name: string;
  description: string;
  href: string;
  size: string;
  icon: ReactNode;
}

export function PackageCard({ name, description, href, size, icon }: PackageCardProps) {
  return (
    <Link href={href} className="package-card group">
      <div className="package-card-header">
        <div className="package-card-icon">
          {icon}
        </div>
        <span className="package-card-badge">{size}</span>
      </div>
      <h3 className="package-card-title">
        {name}
      </h3>
      <p className="package-card-description">
        {description}
      </p>
      <div className="package-card-link">
        Learn more
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

export function PackagesGrid() {
  const packages: PackageCardProps[] = [
    {
      name: '@islam-kit/prayer-times',
      description: 'Calculate accurate prayer times with 14 calculation methods including ISNA, MWL, Egyptian, and more.',
      href: '/docs/prayer-times',
      size: '~5KB',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      name: '@islam-kit/qibla',
      description: 'Calculate Qibla direction from any location on Earth with precise compass directions.',
      href: '/docs/qibla',
      size: '~1KB',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      ),
    },
    {
      name: '@islam-kit/quran',
      description: 'Access Quran surahs, ayahs, translations, and audio recitations from multiple reciters.',
      href: '/docs/quran',
      size: '~2KB',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
      ),
    },
  ];

  return (
    <div className="packages-grid">
      {packages.map((pkg) => (
        <PackageCard key={pkg.name} {...pkg} />
      ))}
    </div>
  );
}
