import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RSA Encryption App',
  description: 'Aplicación para encriptar y desencriptar archivos usando RSA',
  icons: {
    icon: '/icons/lock/favicon.ico'
  },
  manifest: '/icons/lock/site.webmanifest'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
