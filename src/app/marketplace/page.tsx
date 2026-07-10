import { Suspense } from 'react'
import MainPanel from './components/mainPanel'
import { FilterProvider } from '@/context/filters'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explore',
  description: 'Find your next Grail on the Relics ENS Market',
  openGraph: {
    title: 'Marketplace | Relics',
    description: 'Find your next Grail on the Relics ENS Market',
    siteName: 'Marketplace',
    url: 'https://relics.bid/marketplace',
    images: [{ url: 'https://relics.bid/previews/marketplace.jpeg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marketplace | Relics',
    description: 'Find your next Grail on the Relics ENS Market',
    images: 'https://relics.bid/previews/marketplace.jpeg',
  },
}

const Marketplace = () => {
  return (
    <Suspense>
      <FilterProvider filterType='marketplace'>
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

export default Marketplace
