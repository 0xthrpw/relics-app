import type { Metadata, Viewport } from 'next'
import { Cinzel, Inter } from 'next/font/google'
import Providers from './providers'
import SuspendedPostHogPageView from '@/components/posthog/posthog-pageview'
import PostHogGroupSync from '@/components/posthog/posthog-group-sync'
import ServiceWorkerRegistration from '@/components/pwa/service-worker-registration'
import { metadataThemeColor, sharedMetadata } from '@/lib/metadata'
import 'ethereum-identity-kit/css'
import '@rainbow-me/rainbowkit/styles.css'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const cinzel = Cinzel({
  variable: '--font-display',
  subsets: ['latin'],
})

export const metadata: Metadata = sharedMetadata

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  interactiveWidget: 'resizes-content',
  themeColor: metadataThemeColor,
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className='dark'>
      <body className={`${inter.variable} ${cinzel.variable} antialiased`}>
        <Providers>{children}</Providers>
        <ServiceWorkerRegistration />
        <PostHogGroupSync />
        <SuspendedPostHogPageView />
      </body>
    </html>
  )
}
