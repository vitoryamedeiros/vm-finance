import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VM Finance',
    short_name: 'VM Finance',
    description: 'Controle financeiro pessoal autoral premium',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#D81176',
    icons: [
      {
        src: '/icon.svg',
        sizes: '192x192 512x512',
        type: 'image/svg+xml',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      }
    ],
  }
}
