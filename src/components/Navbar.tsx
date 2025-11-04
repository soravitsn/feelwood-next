"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

import { client } from "@/lib/sanity.client";

type ProductMenuItem = {
  id: string;
  href: string;
  label: string;
};

type SanityCategory = {
  _id: string;
  titleTh?: string;
  titleEn?: string;
  slug?: string | null;
};

const CATEGORY_QUERY = `*[_type == "category"] | order(titleTh asc){
  _id,
  titleTh,
  titleEn,
  "slug": slug.current
}`;

export function Navbar() {
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileProductOpen, setIsMobileProductOpen] = useState(false);
  const [productLinks, setProductLinks] = useState<ProductMenuItem[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        setIsLoadingCategories(true);
        const categories = await client.fetch<SanityCategory[]>(CATEGORY_QUERY);

        if (!isMounted) return;

        const mapped = categories
          .filter((category) => category.slug)
          .map<ProductMenuItem>((category) => ({
            id: category._id,
            href: `/products/${category.slug}`,
            label:
              category.titleTh?.trim() ??
              category.titleEn?.trim() ??
              "Unnamed category",
          }));

        setProductLinks(mapped);
      } catch (error) {
        if (isMounted) {
          console.error("Failed to load categories:", error);
        }
      } finally {
        if (isMounted) {
          setIsLoadingCategories(false);
        }
      }
    }

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    setIsMobileProductOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileProductOpen(false);
  };

  const renderProductLinks = (onLinkClick?: () => void): ReactNode => {
    if (isLoadingCategories) {
      return <li className="px-3 py-1.5 text-xs text-slate-400">Loading categories…</li>;
    }

    if (productLinks.length === 0) {
      return <li className="px-3 py-1.5 text-xs text-slate-400">No categories yet</li>;
    }

    return productLinks.map((item) => (
      <li key={item.id}>
        <Link
          href={item.href}
          className="block rounded-xl px-3 py-1.5 transition hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-blue-400"
          role="menuitem"
          onClick={onLinkClick}
        >
          {item.label}
        </Link>
      </li>
    ));
  };

  return (
    <header className="relative z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center">
          <div className="relative w-12 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 md:w-14">
            <div className="relative aspect-square">
              <Image
                src="/images/feelwood-logo.jpg"
                alt="Feel Wood logo"
                fill
                sizes="(max-width: 768px) 48px, 56px"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <nav aria-label="Primary navigation" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
              <li
                className="relative"
                onMouseEnter={() => setIsProductOpen(true)}
                onMouseLeave={() => setIsProductOpen(false)}
                onFocus={() => setIsProductOpen(true)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setIsProductOpen(false);
                  }
                }}
              >
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full px-4 py-1.5 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-400"
                  aria-haspopup="true"
                  aria-expanded={isProductOpen}
                >
                  Product
                  <span className="text-xs text-slate-400">{"\u25BE"}</span>
                </button>
                <div
                  className={`absolute left-0 top-full mt-0 min-w-[220px] rounded-2xl border border-slate-200 bg-white p-3 shadow-lg transition duration-150 ${
                    isProductOpen
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-2 opacity-0"
                  }`}
                  role="menu"
                >
                  <ul className="flex flex-col gap-1 text-left text-sm font-medium normal-case text-slate-600">
                    {renderProductLinks()}
                  </ul>
                </div>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="rounded-full px-4 py-1.5 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-400"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="rounded-full px-4 py-1.5 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-400"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="rounded-full border border-slate-200 px-5 py-1.5 text-slate-600 transition hover:border-blue-500 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-blue-400"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:border-blue-500 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-blue-400 md:hidden"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="flex flex-col items-center justify-center gap-1.5">
              <span
                className={`block h-0.5 w-5 rounded-full bg-current transition-transform duration-200 ${
                  isMobileMenuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-current transition-opacity duration-200 ${
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-current transition-transform duration-200 ${
                  isMobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden transition-[max-height,opacity] duration-200 ${
          isMobileMenuOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden border-t border-slate-200 bg-white`}
      >
        <nav className="px-6 py-3 text-sm font-medium uppercase tracking-[0.15em] text-slate-600">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-400"
            onClick={() => setIsMobileProductOpen((prev) => !prev)}
            aria-expanded={isMobileProductOpen}
          >
            <span>Product</span>
            <span className={`text-xs transition-transform ${isMobileProductOpen ? "rotate-180" : ""}`}>
              {"\u25BE"}
            </span>
          </button>
          <div
            className={`grid overflow-hidden transition-[max-height,opacity] duration-200 ${
              isMobileProductOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <ul className="space-y-1 border-l border-slate-200 pl-4 pt-2 text-[0.95rem] normal-case text-slate-600">
              {renderProductLinks(closeMobileMenu)}
            </ul>
          </div>
          <div className="mt-4 space-y-2 text-[0.95rem] normal-case">
            <Link
              href="/blog"
              className="block rounded-xl px-3 py-1.5 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-400"
              onClick={closeMobileMenu}
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="block rounded-xl px-3 py-1.5 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-400"
              onClick={closeMobileMenu}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block rounded-xl border border-slate-200 px-3 py-1.5 text-center transition hover:border-blue-500 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-blue-400"
              onClick={closeMobileMenu}
            >
              Contact
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
