import type { MetadataRoute } from 'next'
import { APP_URL } from '@/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/og/name', '/api/og/profile'],
      disallow: '/api/',
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  }
}
