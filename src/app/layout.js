import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"]})

export const metadata = {
  title: "GoalSmith",
  description: "Personalized AI Career Coach",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo.png" sizes="any" />
        </head>
        <body
          className={`${inter.className}`}
        >
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {/* header  */}
              <Header />
              <main className="min-h-screen">{children}</main>
              {/* footer  */}
              <footer className="bg-muted/50 py-12">
                <div className="container mx-auto px-4 text-center text-gray-200">
                  <p>Made with ❤️ by Code Therapist!</p>
                </div>
              </footer>
            </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
