import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Navigation from '@/components/Navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Sam Shortlist',
  description: 'Connect with subcontracting opportunities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Navigation />
            <div className="flex-grow">
              <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Breadcrumbs />
                <main>
                  {children}
                </main>
              </div>
            </div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
