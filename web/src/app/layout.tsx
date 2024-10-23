'use client'

import '@/app/globals.css'

import { Inter } from 'next/font/google'
import { Provider } from 'urql'

import { client } from '@/lib/urql/client'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <title>urql-cache-example</title>
        <meta name="description" content="This an exmaple for urql cache." />
      </head>
      <body className={inter.className}>
        <Provider value={client}>
          {children}
        </Provider>
      </body>
    </html>
  )
}
