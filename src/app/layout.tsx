import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google'; // Assuming Geist is preferred over Inter
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { TournamentProvider } from '@/contexts/TournamentContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Trình quản lý MatchPoint',
  description: 'Nền tảng Quản lý Giải đấu Cầu lông',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <TournamentProvider>
          <main>{children}</main>
          <Toaster />
        </TournamentProvider>
      </body>
    </html>
  );
}
