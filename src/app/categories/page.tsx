import { Metadata } from 'next'
import { FilterProvider } from '@/context/filters'
import MainPanel from './components/MainPanel'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: `Categories`,
  description: `Browse all categories on Relics`,
  openGraph: {
    title: `Categories | Relics`,
    siteName: `Categories`,
    description: `Browse all ENS categories on Relics`,
    url: `https://relics.bid/categories`,
    images: [{ url: `https://relics.bid/previews/categories.jpeg` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Categories | Relics`,
    description: `Browse all ENS categories on Relics`,
    images: `https://relics.bid/previews/categories.jpeg`,
  },
}

const CategoriesPage = () => {
  return (
    <Suspense>
      <FilterProvider filterType='categoriesPage'>
        <main className='min-h-[calc(100dvh-52px)] w-full md:min-h-[calc(100dvh-70px)]'>
          <MainPanel />
        </main>
      </FilterProvider>
    </Suspense>
  )
}

export default CategoriesPage
