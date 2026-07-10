import type { Metadata } from 'next'

export const metadataBaseUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://relics.bid')

export const metadataTitle = 'Relics: ENS Manager & Market'
export const metadataSiteName = 'Relics'
export const metadataDescription = 'Your ENS Market. Find, sell, buy, and manage your ENS names on Relics.'
export const metadataThemeColor = '#59cfae'

// Relative URLs: icons resolve against the page origin in the browser, and
// og/twitter images are absolutized by Next via metadataBase — so every asset
// is served by this deployment instead of a hardcoded host.
export const sharedMetadataIcons: Metadata['icons'] = [
  {
    rel: 'icon',
    url: '/favicon.ico',
  },
  {
    rel: 'apple-touch-icon',
    url: '/apple-touch-icon.png',
  },
  {
    rel: 'android-chrome',
    url: '/android-chrome-192x192.png',
  },
]

export const sharedMetadataOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  title: metadataTitle,
  description: metadataDescription,
  locale: 'en_US',
  siteName: metadataSiteName,
  url: metadataBaseUrl,
  emails: ['contact@ethid.org'],
  images: [
    {
      url: '/previews/home.jpeg',
    },
  ],
}

export const sharedMetadataTwitter: Metadata['twitter'] = {
  card: 'summary_large_image',
  description: metadataDescription,
  images: [
    {
      url: '/previews/home.jpeg',
    },
  ],
}

export const sharedMetadata: Metadata = {
  metadataBase: metadataBaseUrl,
  title: {
    default: metadataTitle,
    template: '%s | Relics',
  },
  description: metadataDescription,
  applicationName: metadataSiteName,
  manifest: '/manifest.json',
  keywords: [
    'Relics',
    'Relics Market',
    'Relics ENS Market',
    'Relics ENS',
    'relics.bid',
    'ENS marketplace',
    'ENS names',
  ],
  icons: sharedMetadataIcons,
  openGraph: sharedMetadataOpenGraph,
  twitter: sharedMetadataTwitter,
  authors: {
    name: 'EthID Org',
    url: 'https://ethid.org',
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
    notranslate: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: metadataTitle,
    statusBarStyle: 'black-translucent',
    startupImage: '/apple-touch-icon.png',
  },
  formatDetection: {
    telephone: false,
  },
}
