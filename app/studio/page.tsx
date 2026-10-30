"use client";

import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editor/editor-layout"), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-[#0f0b07] text-[#5a4a38]">
      Loading studio...
    </div>
  ),
});

export default function StudioPage() {
  return <Editor />;
}
