import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { useMemo, useState } from 'react'

/**
 * 观影海报墙 + 导演、主演分行筛选
 */
const MoviePosterWall = ({
  movies = [],
  movieKinds = [],
  movieDirectors = [],
  movieActors = []
}) => {
  const [activeKind, setActiveKind] = useState('全部')
  const [activeDirector, setActiveDirector] = useState('全部')
  const [activeActor, setActiveActor] = useState('全部')

  const filtered = useMemo(() => {
    return (movies || []).filter(movie => {
      if (activeKind !== '全部' && (movie.kind || '') !== activeKind) {
        return false
      }
      if (activeDirector !== '全部' && movie.director !== activeDirector) {
        return false
      }
      if (activeActor !== '全部') {
        const actors = Array.isArray(movie.actors) ? movie.actors : []
        if (!actors.includes(activeActor)) return false
      }
      return true
    })
  }, [movies, activeKind, activeDirector, activeActor])

  const hasFilters =
    movieKinds.length > 0 || movieDirectors.length > 0 || movieActors.length > 0

  const resetFilters = () => {
    setActiveKind('全部')
    setActiveDirector('全部')
    setActiveActor('全部')
  }

  return (
    <div className='w-full px-3 sm:px-4 md:px-0 lg:pr-8 pt-4 md:pt-8 pb-12 md:pb-16'>
      <div className='mb-5 md:mb-8'>
        <h1 className='text-2xl md:text-3xl font-bold dark:text-gray-100'>
          观影记录
        </h1>
        <p className='mt-1.5 md:mt-2 text-sm text-gray-500 dark:text-gray-400'>
          已看 {movies.length} 部 · 点海报进入影评
        </p>
      </div>

      {hasFilters && (
        <div className='mb-5 md:mb-8'>
          <div className='flex flex-col gap-3 md:flex-row md:items-center md:gap-5'>
            <FilterSelect
              label='类型'
              value={activeKind}
              onChange={setActiveKind}
              items={movieKinds}
            />
            <FilterSelect
              label='导演'
              value={activeDirector}
              onChange={setActiveDirector}
              items={movieDirectors}
            />
            <FilterSelect
              label='主演'
              value={activeActor}
              onChange={setActiveActor}
              items={movieActors}
            />
            <button
              type='button'
              onClick={resetFilters}
              className='h-[45px] shrink-0 rounded-lg border border-gray-200 px-3 text-[11px] leading-none text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-white'>
              重置筛选
            </button>
          </div>
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

const FilterSelect = ({ label, items, value, onChange }) => {
  return (
    <label className='flex min-w-0 flex-1 items-center gap-2'>
      <span className='shrink-0 text-sm text-gray-500 dark:text-gray-400'>
        {label}
      </span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className='h-[45px] min-w-0 flex-1 rounded-lg border border-gray-200 bg-transparent px-2 text-[11px] leading-none text-gray-700 outline-none transition-colors focus:border-gray-400 dark:border-gray-700 dark:text-gray-200 dark:focus:border-gray-500'>
        <option value='全部'>全部</option>
        {items.map(item => (
          <option key={item.name} value={item.name}>
            {item.name}
            {typeof item.count === 'number' ? ` (${item.count})` : ''}
          </option>
        ))}
      </select>
    </label>
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
