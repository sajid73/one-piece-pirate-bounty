"use client";

import { PosterProvider } from "@/lib/use-poster-store";
import PosterCanvas from "./poster-canvas";
import Controls from "./controls";
import Link from "next/link";

export default function EditorLayout() {
  return (
    <PosterProvider>
      <div className="h-screen flex flex-col bg-[#0f0b07] text-[#e8dcc8]">
        <header className="flex items-center justify-between px-4 py-3 border-b border-[#2a2420] shrink-0">
          <Link href="/" className="text-[#c9a84c] font-bold text-lg hover:text-[#dab85c] transition-colors">
            Pirate Bounty
          </Link>
          <span className="text-sm text-[#5a4a38]">Poster Studio</span>
        </header>
        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          <div className="flex-1 flex items-center justify-center p-4 min-h-0 overflow-auto">
            <PosterCanvas />
          </div>
          <aside className="md:w-80 shrink-0 border-t md:border-t-0 md:border-l border-[#2a2420] overflow-y-auto bg-[#1a1410] max-h-[45vh] md:max-h-full">
            <Controls />
          </aside>
        </div>
      </div>
    </PosterProvider>
  );
}
