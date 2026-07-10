import { Suspense } from 'react'
import MainPanel from './components/mainPanel'
import { FilterProvider } from '@/context/filters'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bulk Search',
  description: 'Search for multiple ENS names at once on Relics',
  openGraph: {
    title: 'Bulk Search | Relics',
    description: 'Search for multiple ENS names at once on Relics',
    siteName: 'Bulk Search',
    url: 'https://relics.bid/bulk-search',
    images: [{ url: 'https://relics.bid/previews/marketplace.jpeg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk Search | Relics',
    description: 'Search for multiple ENS names at once on Relics',
    images: 'https://relics.bid/previews/marketplace.jpeg',
  },
}

const BulkSearch = () => {
  return (
    <Suspense>
      <FilterProvider filterType='bulkSearch'>
        <main className='min-h-screen'>
          <div className='relative z-10 mx-auto flex w-full flex-col'>
            <div className='bg-background relative flex min-h-[calc(100dvh-54px)] w-full flex-row gap-0 md:min-h-[calc(100dvh-70px)] @[64rem]/app:px-0'>
              <MainPanel />
            </div>
          </div>
        </main>
      </FilterProvider>
    </Suspense>
  )
}

export default BulkSearch
