import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sho Music',
  description: 'AI-native music infrastructure and listening platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="logo">Sho Music</div>
          <nav>
            <a href="/">Home</a>
            <a href="/search">Search</a>
            <a href="/library">Library</a>
            <a href="/creator">Creator</a>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
