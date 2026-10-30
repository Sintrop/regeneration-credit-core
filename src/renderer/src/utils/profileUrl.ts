const USERS_PAGE = import.meta.env.VITE_USERS_PAGE_URL || 'https://users.regenerationcredit.org'

/** Public profile the QR code opens: users.regenerationcredit.org/<type>/<address>/<name-slug>. */
export function profileUrl(type: 'regenerator' | 'supporter', address: string, name = ''): string {
  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `${USERS_PAGE}/${type}/${address}/${slug}`
}
