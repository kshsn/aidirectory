import '@/app/globals.css';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-base">
        {children}
      </body>
    </html>
  );
}
