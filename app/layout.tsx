import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'اجتماع القديس يوحنا الحبيب - كنيسة مارجرجس بسندبيس',
  description:
    'اجتماع القديس يوحنا الحبيب للشباب بكنيسة الشهيد العظيم مارجرجس بسندبيس - بنمو روحي، معرفي، ومهاري في محبة المسيح وكنيسته الأرثوذكسية.',
  openGraph: {
    title: 'اجتماع القديس يوحنا الحبيب للشباب',
    description:
      'بنمو روحي، معرفي، ومهاري في محبة المسيح وكنيسته الأرثوذكسية - #عيلة_واحدة',
    locale: 'ar_EG',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
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
