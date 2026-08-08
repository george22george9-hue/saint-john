import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://saint-john.vercel.app'),
  title: 'اجتماع القديس يوحنا الحبيب للشباب',
  description:
    'الموقع الرسمي لاجتماع القديس يوحنا الحبيب للشباب، يحتوي على الأخبار، المواعيد، الإعلانات، والتواصل مع الخدمة.',
  applicationName: 'Saint John Youth Meeting',
  category: 'Church',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://saint-john.vercel.app',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', type: 'image/png' }],
  },
  openGraph: {
    title: 'اجتماع القديس يوحنا الحبيب للشباب',
    description:
      'الموقع الرسمي لاجتماع القديس يوحنا الحبيب للشباب، يحتوي على الأخبار، المواعيد، الإعلانات، والتواصل مع الخدمة.',
    url: 'https://saint-john.vercel.app',
    siteName: 'Saint John Youth Meeting',
    locale: 'ar_EG',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 800,
        alt: 'اجتماع القديس يوحنا الحبيب',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'اجتماع القديس يوحنا الحبيب للشباب',
    description:
      'الموقع الرسمي لاجتماع القديس يوحنا الحبيب للشباب، يحتوي على الأخبار، المواعيد، الإعلانات، والتواصل مع الخدمة.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
                  var isDark = saved ? saved === 'dark' : !prefersLight;
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.rtl.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
        />
      </head>
      <body className="cinematic-theme">
        {children}
      </body>
    </html>
  );
}
