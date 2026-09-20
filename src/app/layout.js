import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import Footer from "@/components/shared/Footer";
import { Toaster } from "react-hot-toast";
import NavbarComponent from "../components/shared/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  display: "swap",
});


export const metadata = {
  title: "TutorFlux — Book Verified Expert Tutors Online",
  description: "TutorFlux is a premium tutor booking platform where students find verified expert tutors and book 1-on-1 personalized sessions instantly without scheduling conflicts.",
  keywords: "tutor booking, online tutors, 1-on-1 sessions, personalized learning, academic tutors",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${firaCode.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b14] font-sans">
        <NavbarComponent />
        <main className="flex-1">{children}</main>
        <Footer />

        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3500,
            className: "!font-sans",
            style: {
              background: "#0f172a",
              color: "#f1f5f9",
              borderRadius: "14px",
              padding: "12px 18px",
              fontSize: "13px",
              fontWeight: "600",
              border: "1px solid rgba(148,163,184,0.15)",
              boxShadow: "0 10px 30px -5px rgba(0,0,0,0.35)",
            },
            success: {
              iconTheme: { primary: "#22c55e", secondary: "#0f172a" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#0f172a" },
            },
          }}
        />
      </body>
    </html>
  );
}
