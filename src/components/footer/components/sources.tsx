import Link from 'next/link'

const footerSources = [
  {
    text: 'GitHub',
    href: 'https://github.com/0xthrpw/relics-app',
    target: '_blank',
  },
]

const Sources = () => {
  return (
    <section className='flex flex-col gap-4'>
      {footerSources.map((source) => (
        <div
          className='text-foreground/80 hover:text-foreground w-fit text-lg font-medium transition-transform'
          key={`source-${source.href}`}
        >
          <Link href={source.href} target={source.target} rel='noreferrer'>
            <span>{source.text}</span>
          </Link>
        </div>
      ))}
    </section>
  )
}

export default Sources
