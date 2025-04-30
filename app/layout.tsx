import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Image from "next/image";
import Logo from "@/app/logo.png";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.NETLIFY_URL
  ? `https://${process.env.NETLIFY_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Music Campaign",
  description: "Best Music Campaign Company etc.",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                  <Link href={"/"} className="flex items-center">
                    <Image
                      src={Logo}
                      alt="Logo"
                      width={40}
                      height={40}
                      className="h-8 w-auto object-contain"
                      priority
                    />
                  </Link>      
                  </div>
                  <div className="flex items-center gap-4">
                    <HeaderAuth />
                    <ThemeSwitcher />
                  </div>
                </div>
              </nav>
              <div className="flex flex-col gap-20 max-w-5xl p-5">
                {children}
              </div>
          </div>
              <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-2 py-10">
                <p>
                  Powered by{" "}
                  <Link href={"https://github.com/suspect-otw"}>
                    suspect-otw
                  </Link>
                </p>
              </footer>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
