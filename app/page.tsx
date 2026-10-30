"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const HeroScene = dynamic(
  () => import("@/components/landing/hero-scene"),
  { ssr: false, loading: () => <div className="w-full h-full" /> },
);

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f0b07] text-[#e8dcc8]">
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <HeroScene />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-12 w-full pointer-events-none">
          <div className="flex-1 space-y-8 pointer-events-auto bg-[#0f0b07]/80 lg:bg-transparent p-6 lg:p-0 rounded-xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="text-[#c9a84c]">PIRATE</span>{" "}
              <span className="text-[#f5e6c8]">BOUNTY</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#8a7a68] max-w-lg">
              Your face. Your legend. Your bounty.
            </p>
            <p className="text-base text-[#6a5a48] max-w-md">
              Create a stunning vintage wanted poster with your photo. Customize
              every detail and download in high resolution.
            </p>
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#c9a84c] text-[#0f0b07] font-bold text-lg rounded-lg hover:bg-[#dab85c] transition-colors"
            >
              Create Your Poster
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="flex-1 min-h-[500px] hidden lg:block" />
        </div>
      </section>

      <section className="py-20 px-6 bg-[#1a1410]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-[#c9a84c]">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { n: "01", t: "Upload", d: "Drop your best photo into the poster." },
              { n: "02", t: "Customize", d: "Set your name, bounty, and style every detail." },
              { n: "03", t: "Download", d: "Export in stunning high resolution." },
            ].map((i) => (
              <div key={i.n} className="text-center space-y-4">
                <div className="text-5xl font-bold text-[#3d3020]">{i.n}</div>
                <h3 className="text-xl font-bold text-[#f5e6c8]">{i.t}</h3>
                <p className="text-[#8a7a68]">{i.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            { t: "Vintage Aesthetics", d: "Aged parchment, distressed ink, and cinematic typography." },
            { t: "Full Customization", d: "Fonts, colors, textures, borders, and decorative elements." },
            { t: "High Resolution", d: "Export at 2x and 4x for print-quality results." },
            { t: "100% Private", d: "Everything runs in your browser. Photos never leave your device." },
          ].map((f) => (
            <div key={f.t} className="flex gap-4 items-start">
              <div className="w-2 h-2 rounded-full bg-[#c9a84c] mt-2 shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-[#f5e6c8] mb-1">{f.t}</h3>
                <p className="text-[#8a7a68]">{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-[#2a2420]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-[#5a4a38]">
          <span>Pirate Bounty</span>
          <span>Client-side only. Your photos stay on your device.</span>
        </div>
      </footer>
    </div>
  );
}
