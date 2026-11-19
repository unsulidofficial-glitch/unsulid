import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import CartToast from '@/components/cart/CartToast';
import OtpModal from '@/components/auth/OtpModal';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#5B0F18',
};

export const metadata: Metadata = {
  title: {
    default: 'UNSULID | Affordable Premium Luxury Fragrances',
    template: '%s | UNSULID',
  },
  description:
    'UNSULID is a direct-to-consumer luxury fragrance house crafting accessible premium perfumes for modern self-expression. Discover our debut collection: HIGH CLASS and BLACK.',
  keywords: [
    'UNSULID',
    'Luxury Perfumes India',
    'HIGH CLASS Perfume',
    'BLACK Perfume',
    'Affordable Premium Fragrance',
    'D2C Perfume',
  ],
  authors: [{ name: 'UNSULID' }],
  metadataBase: new URL('https://unsulid.com'),
  openGraph: {
    title: 'UNSULID | Affordable Premium Luxury Fragrances',
    description:
      'Accessible luxury perfumes crafted for modern self-expression. Discover our debut collection: HIGH CLASS and BLACK.',
    url: 'https://unsulid.com',
    siteName: 'UNSULID',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UNSULID | Luxury Fragrances',
    description:
      'Accessible luxury perfumes crafted for modern self-expression. Discover HIGH CLASS and BLACK.',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="font-sans bg-brand-cream text-brand-black antialiased selection:bg-brand-burgundy selection:text-brand-cream">
        <AuthProvider>
          <CartProvider>
            {children}
            <CartToast />
            <OtpModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
