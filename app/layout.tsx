import { Providers } from './providers';
import './globals.css';

export const metadata = {
  title: 'School Management System',
  description: 'A comprehensive school management platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
