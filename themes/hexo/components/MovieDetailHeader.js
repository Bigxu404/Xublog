import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'

/**
 * 电影影评页头部：海报 + 元信息
 */
const MovieDetailHeader = ({ post }) => {
  if (!post) return null

  const cover = post.pageCoverThumbnail || post.pageCover || '/bg_image.jpg'
  const rating = Array.isArray(post.rating) ? post.rating[0] : post.rating
  const director = Array.isArray(post.director)
    ? post.director[0]
    : post.director
  const actors = Array.isArray(post.actors)
    ? post.actors.filter(Boolean)
    : post.actors
      ? String(post.actors)
          .split(/[,，、]/)
          .map(s => s.trim())
          .filter(Boolean)
      : []

  return (
    <div className='w-full mb-8'>
      <div className='mb-4'>
        <SmartLink
          href='/movies'
          className='text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'>
          ← 返回观影墙
        </SmartLink>
      </div>

      <div className='flex flex-col md:flex-row gap-6 md:gap-8'>
        <div className='w-40 md:w-52 shrink-0 mx-auto md:mx-0'>
          <div className='aspect-[2/3] overflow-hidden rounded-xl border dark:border-black shadow'>
            <LazyImage
              src={cover}
              alt={post.title}
              className='h-full w-full object-cover'
            />
          </div>
        </div>

        <div className='flex-1 min-w-0'>
          <h1 className='text-2xl md:text-3xl font-bold dark:text-gray-100'>
            {post.title}
          </h1>

          <div className='mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400'>
            {post.publishDay ? <span>观看于 {post.publishDay}</span> : null}
            {rating ? <span>评分 ★ {rating}</span> : null}
          </div>

          {(director || actors.length > 0) && (
            <div className='mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-300'>
              {director ? (
                <div>
                  <span className='text-gray-400 dark:text-gray-500'>导演 </span>
                  {director}
                </div>
              ) : null}
              {actors.length > 0 ? (
                <div>
                  <span className='text-gray-400 dark:text-gray-500'>主演 </span>
                  {actors.join('、')}
                </div>
              ) : null}
            </div>
          )}

          {post.summary ? (
            <p className='mt-4 text-gray-600 dark:text-gray-300 leading-relaxed'>
              {post.summary}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default MovieDetailHeader
