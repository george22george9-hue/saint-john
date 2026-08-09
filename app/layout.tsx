import type { Metadata, Viewport } from 'next';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
};

const siteTitle = 'اجتماع القديس يوحنا الحبيب للشباب | كنيسة مارجرجس سندبيس';
const siteDescription =
  'الموقع الرسمي لاجتماع القديس يوحنا الحبيب للشباب بكنيسة الشهيد العظيم مارجرجس بسندبيس. يضم الأخبار، والفعاليات، والإعلانات، وجدول المواعيد، والتواصل مع الخدمة.';
const siteUrl = 'https://saint-john.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  applicationName: 'Saint John Youth Meeting',
  category: 'Church',
  verification: {
    google: 'RENpYa2yO1eJy9QBGEFRJWz7uB0-lZP0Q3EtuhT4bPo',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${siteUrl}/`,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', type: 'image/png' }],
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: `${siteUrl}/`,
    siteName: 'اجتماع القديس يوحنا الحبيب للشباب - كنيسة مارجرجس سندبيس',
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
    title: siteTitle,
    description: siteDescription,
    images: ['/logo.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'اجتماع القديس يوحنا الحبيب للشباب',
      alternateName: 'اجتماع القديس يوحنا الحبيب للشباب بكنيسة مارجرجس سندبيس',
      url: `${siteUrl}/`,
      logo: `${siteUrl}/logo.png`,
      sameAs: [
        'https://www.facebook.com/share/1ESrPMcJEC/',
        'https://whatsapp.com/channel/0029VarbdqNCXC3T4BwPj90V',
        'https://www.tiktok.com/@stjohnmeeting?_r=1&_t=ZS-98fBl2ThvFK',
        'https://www.instagram.com/stjohnmeeting?igsh=ejNoNnIwaDlreWdv',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: 'اجتماع القديس يوحنا الحبيب للشباب',
      description: siteDescription,
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
      inLanguage: 'ar',
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
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
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}

