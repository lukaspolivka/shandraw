import { Metadata } from 'next';

export const siteURL = 'https://shandraw.vercel.app';

const title = 'Shandraw — Code-driven ER Diagram Tool';
const description =
  'Design and visualize entity-relationship diagrams with code. Shandraw is a powerful, offline-ready ER diagram editor for developers and database architects.';

const keywords = [
  'ER Diagram',
  'ERD Tool',
  'Database Design',
  'DBML',
  'Entity Relationship Diagram',
  'Schema Visualization',
  'Database Tool',
  'Offline ERD Editor',
  'Developer Tools',
];

export const siteMetadata: Metadata = {
  metadataBase: new URL(siteURL),
  title: {
    default: title,
    template: '%s | Shandraw',
  },
  description,
  keywords,
  applicationName: 'Shandraw',
  category: 'Developer Tools',
  authors: [
    {
      name: 'Mohammad Farhad',
      url: 'https://mfarhad-dev.vercel.app',
    },
  ],
  creator: 'Mohammad Farhad',
  publisher: 'Devsyte',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title,
    description,
    url: siteURL,
    siteName: 'Shandraw',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${siteURL}/icon.png`,
        width: 1200,
        height: 630,
        alt: 'Shandraw Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    creator: '@shandraw',
    site: '@shandraw',
    images: [`${siteURL}/icon.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
};