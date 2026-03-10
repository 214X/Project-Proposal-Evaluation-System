import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Proposal Upload Test',
  description: 'Upload a PDF for evaluation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
