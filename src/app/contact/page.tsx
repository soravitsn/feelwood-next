"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Navbar } from "@/components/Navbar";

const LINE_QR_SRC = "/images/QR.png";

export default function ContactPage() {
  const [isLineModalOpen, setIsLineModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-6 pt-10 pb-16 sm:pt-12">
        <header className="mb-12 flex flex-col gap-4 text-center sm:mb-14">
          <p className="text-sm uppercase tracking-[0.4em] text-blue-500">
            Contact Feel Wood
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            มาเยี่ยมชมโชว์รูมหรือพูดคุยกับทีม Feel Wood ได้ทุกวัน
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg">
            เราพร้อมให้คำปรึกษาเรื่องวัสดุไม้ งานติดตั้ง และการดูแลหลังการขาย
            นัดหมายล่วงหน้า หรือแวะมาที่โชว์รูมเพื่อสัมผัสตัวอย่างสินค้าได้ทันที
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.25fr,0.75fr]">
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm sm:p-10">
            <h2 className="text-2xl font-semibold text-slate-900">ข้อมูลติดต่อ</h2>
            <dl className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2 sm:gap-y-6">
              <div className="space-y-1 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4">
                <dt className="text-xs uppercase tracking-[0.3em] text-blue-500">
                  เบอร์ติดต่อ
                </dt>
                <dd className="text-base font-semibold text-slate-900">
                  <a href="tel:0826611414" className="hover:text-blue-600">
                    082-661-1414
                  </a>
                </dd>
              </div>
              <div className="space-y-1 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4">
                <dt className="text-xs uppercase tracking-[0.3em] text-blue-500">
                  เวลาทำการ
                </dt>
                <dd className="text-base font-semibold text-slate-900">
                  08.00 - 17.00 น.
                </dd>
                <dd className="text-xs text-slate-500">หยุดทุกวันศุกร์</dd>
              </div>
              <div className="space-y-1 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 sm:col-span-2">
                <dt className="text-xs uppercase tracking-[0.3em] text-blue-500">
                  Line Official
                </dt>
                <dd className="text-base font-semibold text-slate-900">
                  <button
                    type="button"
                    onClick={() => setIsLineModalOpen(true)}
                    className="inline-flex items-center gap-2 text-blue-600 transition hover:text-blue-500"
                  >
                    @feelwood
                    <span aria-hidden>→</span>
                  </button>
                </dd>
              </div>
              <div className="space-y-1 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 sm:col-span-2">
                <dt className="text-xs uppercase tracking-[0.3em] text-blue-500">
                  Email
                </dt>
                <dd className="text-base font-semibold text-slate-900">
                  <a
                    href="mailto:feelwood.hdy@gmail.com"
                    className="inline-flex items-center gap-2 hover:text-blue-600"
                  >
                    feelwood.hdy@gmail.com
                  </a>
                </dd>
              </div>
            </dl>

            <div className="rounded-3xl border border-slate-200 bg-white p-2 shadow-inner">
              <div className="relative aspect-[5/3] overflow-hidden rounded-[22px]">
                <iframe
                  title="Feel Wood Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.189346038667!2d100.42984227448319!3d6.986964017605149!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304d27e7fb2af1d7%3A0xc2c87e5ef9af5e00!2zRmVlbCBXb29kICjguJ_guLXguKXguKfguLnguJQpIOC4h-C4suC4meC5hOC4oeC5iSDguJvguKPguLDguJXguLnguYTguKHguYkg4Lia4Lix4LiZ4LmE4LiU4LmE4Lih4LmJ!5e0!3m2!1sen!2sth!4v1762076641413!5m2!1sen!2sth"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0"
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                * พิกัดอ้างอิงจาก Google Maps{" "}
                <Link
                  href="https://maps.app.goo.gl/nbeSovzNbRptmktE9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-400"
                >
                  เปิดแผนที่ในแอป
                </Link>
              </p>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                นัดหมายล่วงหน้า?
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                ส่งรายละเอียดโปรเจ็กต์และเวลาที่สะดวกให้เรา ทีมงานจะติดต่อกลับภายใน 1 วันทำการ
              </p>
              <Link
                href="mailto:feelwood.hdy@gmail.com"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-blue-500"
              >
                ส่งอีเมลหาเรา
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                ต้องการปรึกษาด่วน?
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                โทรหาเราได้ทันที หรือเพิ่ม LINE เพื่อคุยกับทีมงานแบบ real-time
              </p>
              <button
                type="button"
                onClick={() => setIsLineModalOpen(true)}
                className="mt-4 inline-flex items-center justify-center rounded-full border border-green-500 px-5 py-2 text-sm font-semibold text-green-600 transition hover:bg-green-500 hover:text-white"
              >
                เปิด QR LINE Official
              </button>
            </div>
          </aside>
        </section>
      </main>

      {isLineModalOpen && (
        <LineModal onClose={() => setIsLineModalOpen(false)} />
      )}
    </div>
  );
}

type LineModalProps = {
  onClose: () => void;
};

function LineModal({ onClose }: LineModalProps) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-6 py-12">
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className="relative z-10 flex max-h-full w-full max-w-md flex-col items-center gap-5 overflow-hidden rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
          aria-label="ปิดหน้าต่าง QR Code"
        >
          ✕
        </button>
        <h2 className="mt-6 text-xl font-semibold text-slate-900">
          เพิ่มเพื่อน LINE @feelwood
        </h2>
        <Image
          src={LINE_QR_SRC}
          alt="Feel Wood LINE Official QR Code"
          width={260}
          height={320}
          className="h-auto w-full max-w-[260px] rounded-xl object-contain"
          priority
          unoptimized
        />
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          สแกนหรือแตะลิงก์ด้านล่าง
        </p>
        <Link
          href="https://line.me/R/ti/p/@feelwood"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-green-500 px-5 py-2 text-sm font-semibold text-green-600 transition hover:bg-green-500 hover:text-white"
        >
          เปิด LINE Official
        </Link>
      </div>
    </div>
  );
}
