/**
 * 确保导航中有观影入口（CUSTOM_MENU 开启时也会补上）
 */
export function ensureMoviesMenuLink(links, { enabled = true } = {}) {
  if (!enabled) return links || []
  const list = Array.isArray(links) ? [...links] : []
  const hasMovies = list.some(link => {
    const href = String(link?.href || link?.slug || '')
    return href === '/movies' || href === 'movies' || href.endsWith('/movies')
  })
  if (!hasMovies) {
    list.push({
      id: list.length,
      icon: 'fas fa-film',
      name: '观影',
      href: '/movies',
      show: true,
      target: '_self'
    })
  }
  return list
}
