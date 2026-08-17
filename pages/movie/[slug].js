import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getStaticPathsBase } from '@/lib/build/staticPaths'
import { resolvePostProps } from '@/lib/db/SiteDataApi'
import { isExport } from '@/lib/utils/buildMode'
import { DynamicLayout } from '@/themes/theme'

const isStaticExport = process.env.EXPORT === 'true'

/**
 * 单部电影影评页 /movie/[slug]
 */
const MovieSlug = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutMovie' {...props} />
}

export async function getStaticPaths() {
  return getStaticPathsBase({
    from: 'movie-slug-paths',
    filterFn: row =>
      row?.type === 'Movie' &&
      row?.status === 'Published' &&
      typeof row?.slug === 'string' &&
      row.slug.startsWith('movie/'),
    mapPageToParams: row => ({
      params: {
        slug: row.slug.replace(/^movie\//, '')
      }
    })
  })
}

export async function getStaticProps({ params: { slug }, locale }) {
  const props = await resolvePostProps({
    prefix: 'movie',
    slug,
    locale,
    from: 'movie-slug'
  })

  // 仅允许 Movie 类型命中本路由
  if (props.post && props.post.type !== 'Movie') {
    props.post = null
  }

  return {
    props,
    revalidate: isStaticExport
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        ),
    notFound: !props.post
  }
}

export default MovieSlug
