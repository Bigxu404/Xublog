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

function countNames(movies, pickNames) {
  const nameSet = new Map()
  movies.forEach(movie => {
    pickNames(movie).forEach(name => {
      if (!name) return
      nameSet.set(name, (nameSet.get(name) || 0) + 1)
    })
  })
  return Array.from(nameSet.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh'))
}

function buildMovieFilters(movies) {
  return {
    movieDirectors: countNames(movies, movie =>
      movie.director ? [movie.director] : []
    ),
    movieActors: countNames(movies, movie =>
      Array.isArray(movie.actors) ? movie.actors.filter(Boolean) : []
    )
  }
}

export async function getStaticProps({ locale }) {
  const props = await fetchGlobalAllData({ from: 'movies-index', locale })
  // TEMP: 本地预览样式；确认后删除 lib/mock/movieMock.js 与此处引用
  const movies = ENABLE_MOVIE_MOCK ? MOCK_MOVIES : props.allMovies || []

  const { movieDirectors, movieActors } = buildMovieFilters(movies)
  props.movies = movies
  props.movieDirectors = movieDirectors
  props.movieActors = movieActors

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
