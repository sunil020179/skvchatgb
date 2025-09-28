import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { QueryProvider } from '@/components/query-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SKVChatGB — Powerful AI Business Consultant',
  description: 'Advanced country-aware AI chatbot platform for business consultation across UAE, India, Hungary, and UK. Get expert advice on company formation, tax compliance, visas, and business regulations.',
  keywords: 'AI chatbot, business consultant, UAE company setup, India GST, Hungary Kft, UK Ltd, SKV Business Services',
  authors: [{ name: 'SKV Business Service LLC' }],
  creator: 'SKV Business Service LLC',
  publisher: 'SKV Business Service LLC',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1021' }
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://skvchatgb.com',
    title: 'SKVChatGB — Powerful AI Business Consultant',
    description: 'Advanced country-aware AI chatbot platform for business consultation across UAE, India, Hungary, and UK.',
    siteName: 'SKVChatGB',
    images: [
      {
        url: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/16af5dd6-403c-4612-a8ad-c2d2f2c64685.png',
        width: 1200,
        height: 630,
        alt: 'SKVChatGB - AI Business Consultant Platform'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SKVChatGB — Powerful AI Business Consultant',
    description: 'Advanced country-aware AI chatbot platform for business consultation across UAE, India, Hungary, and UK.',
    images: ['https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/85e69f5a-a6c1-4bda-9a40-95c2d43ddc18.png']
  },
  alternates: {
    canonical: 'https://skvchatgb.com'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#0b1021" />
        <meta name="theme-color" content="#0b1021" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <div className="relative min-h-screen bg-background text-foreground">
              <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background/60" />
              <div className="relative z-10">
                {children}
              </div>
            </div>
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}