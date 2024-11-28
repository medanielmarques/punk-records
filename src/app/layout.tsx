import { ThemeProvider } from "@/components/theme-provider"
import "@/styles/globals.css"
import { TRPCReactProvider } from "@/trpc/react"
import { GeistSans } from "geist/font/sans"
import { type Metadata } from "next"

export const metadata: Metadata = {
  title: "Punk Records",
  description: "Punk Records",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
