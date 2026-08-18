import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { useMemo, useState } from 'react'

/**
 * 观影海报墙 + 导演、主演分行筛选
 */
const MoviePosterWall = ({
  movies = [],
  movieDirectors = [],
  movieActors = []
}) => {
  const [activeDirector, setActiveDirector] = useState('全部')
  const [activeActor, setActiveActor] = useState('全部')

  const filtered = useMemo(() => {
    return (movies || []).filter(movie => {
      if (activeDirector !== '全部' && movie.director !== activeDirector) {
        return false
      }
      if (activeActor !== '全部') {
        const actors = Array.isArray(movie.actors) ? movie.actors : []
        if (!actors.includes(activeActor)) return false
      }
      return true
    })
  }, [movies, activeDirector, activeActor])

  const hasFilters = movieDirectors.length > 0 || movieActors.length > 0

  return (
    <div className='w-full px-3 sm:px-4 md:px-0 lg:pr-8 pt-4 md:pt-8 pb-12 md:pb-16'>
      <div className='mb-5 md:mb-8'>
        <h1 className='text-2xl md:text-3xl font-bold dark:text-gray-100'>
          观影
        </h1>
        <p className='mt-1.5 md:mt-2 text-sm text-gray-500 dark:text-gray-400'>
          已看 {movies.length} 部 · 点海报进入影评
        </p>
      </div>

      {hasFilters && (
        <div className='mb-5 md:mb-8 space-y-3 md:space-y-4'>
          {movieDirectors.length > 0 && (
            <FilterRow
              label='导演'
              active={activeDirector}
              onChange={setActiveDirector}
              items={[
                { name: '全部', count: movies.length },
                ...movieDirectors
              ]}
            />
          )}
          {movieActors.length > 0 && (
            <FilterRow
              label='主演'
              active={activeActor}
              onChange={setActiveActor}
              items={[{ name: '全部', count: movies.length }, ...movieActors]}
            />
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className='py-16 md:py-20 px-2 text-center text-sm md:text-base text-gray-400 dark:text-gray-500'>
          暂无符合条件的影片。在 Notion 中新增 type=Movie 的条目即可出现在这里。
        </div>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6'>
          {filtered.map(movie => (
            <MoviePosterCard key={movie.id || movie.slug} movie={movie} />
          ))}
        </div>
      )}
    </div>
  )
}

const FilterRow = ({ label, items, active, onChange }) => {
  return (
    <div className='flex items-center gap-2 md:block'>
      <div className='shrink-0 w-9 md:w-auto text-xs tracking-wide text-gray-400 md:mb-2'>
        {label}
      </div>
      <div className='min-w-0 flex-1 overflow-x-auto movie-filter-scroll touch-pan-x md:overflow-visible'>
        <div className='flex w-max gap-2 pb-0.5 md:w-auto md:flex-wrap md:pb-0'>
          {items.map(item => {
            const selected = active === item.name
            return (
              <button
                key={item.name}
                type='button'
                onClick={() => onChange(item.name)}
                className={`shrink-0 whitespace-nowrap px-3 py-1.5 text-xs md:text-sm rounded-full border transition-colors touch-manipulation ${
                  selected
                    ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 dark:bg-hexo-black-gray dark:text-gray-300 dark:border-gray-700'
                }`}>
                {item.name}
                {typeof item.count === 'number' && (
                  <span className='ml-1 opacity-60'>{item.count}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const MoviePosterCard = ({ movie }) => {
  const cover =
    movie.pageCoverThumbnail || movie.pageCover || '/bg_image.jpg'
  const credit =
    movie.director ||
    (Array.isArray(movie.actors) && movie.actors[0]) ||
    ''

  return (
    <SmartLink href={movie.href || '#'} className='group block min-w-0'>
      <div className='relative aspect-[2/3] overflow-hidden rounded-lg md:rounded-xl border border-gray-100 dark:border-black bg-gray-100 dark:bg-black shadow-sm'>
        <LazyImage
          src={cover}
          alt={movie.title}
          className='h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90' />
        <div className='absolute bottom-0 left-0 right-0 p-2 md:p-3 text-white'>
          <div className='font-semibold text-xs sm:text-sm md:text-base line-clamp-2'>
            {movie.title}
          </div>
          <div className='mt-0.5 md:mt-1 flex items-center justify-between gap-1 text-[10px] sm:text-xs text-white/80'>
            <span className='truncate'>{credit || movie.publishDay || ''}</span>
            {movie.rating ? (
              <span className='shrink-0'>★ {movie.rating}</span>
            ) : null}
          </div>
        </div>
      </div>
      {movie.summary ? (
        <p className='hidden sm:block mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2'>
          {movie.summary}
        </p>
      ) : null}
    </SmartLink>
  )
}

export default MoviePosterWall
