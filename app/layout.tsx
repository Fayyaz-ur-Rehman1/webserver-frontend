import './globals.css';
import { AppProvider } from './context/AppContext';

export const metadata = {
  title: 'WhatsApp Bulk Messaging SaaS Platform',
  description: 'Enterprise WhatsApp Bulk Messaging Web Application with Real-Time QR Auth, Excel Import & Sequential Dispatching',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="antialiased bg-slate-950 text-slate-100 min-h-screen"
        suppressHydrationWarning
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
