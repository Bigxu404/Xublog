import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { ENABLE_MOVIE_MOCK, MOCK_MOVIES } from '@/lib/mock/movieMock'
import { DynamicLayout } from '@/themes/theme'

/**
 * 观影海报墙
 */
const MoviesIndex = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutMovieList' {...props} />
}

/** 单一维度：导演 + 主演合并为「人物」筛选项 */
function buildMoviePeople(movies) {
  const peopleSet = new Map()
  movies.forEach(movie => {
    const names =
      movie.people?.length > 0
        ? movie.people
        : [
            movie.director,
            ...(Array.isArray(movie.actors) ? movie.actors : [])
          ].filter(Boolean)
    names.forEach(name => {
      peopleSet.set(name, (peopleSet.get(name) || 0) + 1)
    })
  })

  return Array.from(peopleSet.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh'))
}

export async function getStaticProps({ locale }) {
  const props = await fetchGlobalAllData({ from: 'movies-index', locale })
  // TEMP: 本地预览样式；确认后删除 lib/mock/movieMock.js 与此处引用
  const movies = ENABLE_MOVIE_MOCK ? MOCK_MOVIES : props.allMovies || []

  props.movies = movies
  props.moviePeople = buildMoviePeople(movies)

  delete props.allPages
  delete props.allMovies

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default MoviesIndex
