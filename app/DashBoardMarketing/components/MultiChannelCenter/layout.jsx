"use client"; 
import { MantineProvider } from '@mantine/core';

export default function RootLayout({ children }) {
  return (
    <MantineProvider>
      <html lang="ar">
        <body>{children}</body>
      </html>
    </MantineProvider>
  );
}