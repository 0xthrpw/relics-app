import type { Metadata } from 'next'
import type { SearchParams } from 'next/dist/server/request/search-params'
import CategoryPage from './components/category'
import { CATEGORY_LABELS } from '@/constants/domains/marketplaceDomains'

interface Props {
  params: Promise<{ category: string }>
  searchParams: Promise<SearchParams>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const category = params.category

  const categoryLabel = CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category

  return {
    title: `${categoryLabel} Category`,
    description: `${categoryLabel} Category on Relics Marketplace`,
    openGraph: {
      title: `${categoryLabel} Category | Relics`,
      siteName: `${categoryLabel} Category`,
      description: `${categoryLabel} Category on Relics Marketplace`,
      url: `https://relics.bid/categories/${category}`,
      images: [{ url: `https://relics.bid/api/og/category?category=${category}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryLabel} Category | Relics`,
      description: `${categoryLabel} Category on Relics Marketplace`,
      images: `https://relics.bid/api/og/category?category=${category}`,
    },
  }
}

const UserPage = async (props: Props) => {
  const { category } = await props.params

  return (
    <main className='w-full'>
      <CategoryPage category={category} />
    </main>
  )
}

export default UserPage
