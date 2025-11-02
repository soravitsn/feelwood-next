"use client";

import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-6 py-24 text-center text-slate-500">
        <p>พร้อมปรับแต่งโฮมเพจต่อไป เริ่มจาก Navbar แล้ววางโครงสร้างส่วนอื่น ๆ ภายหลัง</p>
      </main>
    </div>
  );
}
