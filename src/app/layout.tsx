import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "가상화폐 적립식 투자 시뮬레이터",
  description:
    "가상화폐에 적립식으로 투자하면 수익률이 얼마나 나는지 시뮬레이트해보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`h-full ${inter.variable}`}>
      <body className="min-h-screen h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 antialiased font-sans selection:bg-indigo-500/70">
        <div className="container max-w-4xl mx-auto px-6 py-8">
          <header className="pb-8 flex items-center">
            <h1 className="text-2xl font-bold tracking-tight">
              CryptoSaver<span className="text-indigo-400">.</span>
            </h1>
            <a
              href="https://github.com/y10b/crypto_port"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto opacity-70 hover:opacity-100 transition-opacity duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.012c0 4.424 2.865 8.18 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.455-1.158-1.11-1.466-1.11-1.466-.908-.621.069-.609.069-.609 1.004.071 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.094.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.706.115 2.507.338 1.909-1.295 2.748-1.026 2.748-1.026.546 1.378.203 2.397.1 2.65.64.7 1.028 1.594 1.028 2.688 0 3.848-2.338 4.695-4.566 4.943.359.31.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .268.18.58.688.481A10.015 10.015 0 0 0 22 12.012C22 6.484 17.523 2 12 2Z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </header>
          {children}
          <footer className="pt-12 pb-6 text-xs text-slate-500 text-center">
            © 2025 y10b • Data from Upbit Open API
          </footer>
        </div>
      </body>
    </html>
  );
}
