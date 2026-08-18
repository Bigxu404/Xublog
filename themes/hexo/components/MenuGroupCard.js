import SmartLink from '@/components/SmartLink'

const MenuGroupCard = props => {
  const { postCount, allMovies = [], movies = [] } = props
  const movieCount = allMovies.length || movies.length || 0
  const archiveSlot = <div className='text-center'>{postCount}</div>
  const movieSlot = <div className='text-center'>{movieCount}</div>

  const links = [
    {
      name: '文章数量',
      href: '/archive',
      slot: archiveSlot,
      show: true
    },
    {
      name: '观影数量',
      href: '/movies',
      slot: movieSlot,
      show: true
    }
  ]

  for (let i = 0; i < links.length; i++) {
    if (links[i].id !== i) {
      links[i].id = i
    }
  }

  return (
    <nav
      id='nav'
      className='leading-8 flex justify-center  dark:text-gray-200 w-full'>
      {links.map(link => {
        if (link.show) {
          return (
            <SmartLink
              key={`${link.href}`}
              title={link.href}
              href={link.href}
              target={link?.target}
              className={
                'py-1.5 my-1 px-2 duration-300 text-base justify-center items-center cursor-pointer'
              }>
              <div className='w-full items-center justify-center hover:scale-105 duration-200 transform dark:hover:text-indigo-400 hover:text-indigo-600'>
                <div className='text-center'>{link.name}</div>
                <div className='text-center font-semibold'>{link.slot}</div>
              </div>
            </SmartLink>
          )
        } else {
          return null
        }
      })}
    </nav>
  )
}
export default MenuGroupCard
