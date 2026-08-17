import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { ENABLE_MOVIE_MOCK, MOCK_MOVIES } from '@/lib/mock/movieMock'
import CONFIG from '../config'

/**
 * 侧栏观影报告：横向滑动海报
 */
const MovieShelfCard = ({ allMovies = [], movies }) => {
  const source =
    ENABLE_MOVIE_MOCK && !(movies || allMovies)?.length
      ? MOCK_MOVIES
      : movies || allMovies || []
  const list = source.slice(
    0,
    siteConfig('HEXO_WIDGET_MOVIES_COUNT', 8, CONFIG)
  )

  if (!list.length) {
    return null
  }

  return (
    <>
      <div className='mb-3 px-1 flex flex-nowrap justify-between items-center'>
        <div>
          <i className='mr-2 fas fa-film' />
          我的观影报告
        </div>
        <SmartLink
          href='/movies'
          className='text-xs text-gray-500 hover:text-indigo-400 dark:text-gray-400'>
          全部 →
        </SmartLink>
      </div>

      <div className='movie-shelf-scroll flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory'>
        {list.map(movie => {
          const cover =
            movie.pageCoverThumbnail || movie.pageCover || '/bg_image.jpg'
          return (
            <SmartLink
              key={movie.id || movie.slug}
              href={movie.href || '/movies'}
              title={movie.title}
              className='snap-start shrink-0 w-20 group'>
              <div className='aspect-[2/3] w-20 overflow-hidden rounded-lg border dark:border-black bg-black/20'>
                <LazyImage
                  src={cover}
                  alt={movie.title}
                  className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                />
              </div>
              <div className='mt-1.5 text-[11px] leading-tight line-clamp-2 text-gray-600 dark:text-gray-400 group-hover:text-indigo-400'>
                {movie.title}
              </div>
            </SmartLink>
          )
        })}
      </div>
    </>
  )
}

export default MovieShelfCard
