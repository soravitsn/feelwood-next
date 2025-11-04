"use server";

import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { Navbar } from "@/components/Navbar";
import { client } from "@/lib/sanity.client";

type ProductImage = {
  _key: string;
  url?: string;
};

type ProductSummary = {
  _id: string;
  title: string;
  code?: string;
  summary?: string;
  images: ProductImage[];
  specUrl?: string;
  isFeatured?: boolean;
};

type CategoryPageData = {
  _id: string;
  titleTh?: string;
  titleEn?: string;
  excerptTh?: string;
  excerptEn?: string;
  tagsTh?: string[];
  tagsEn?: string[];
  imageUrl?: string;
  imageAlt?: string;
  products: ProductSummary[];
};

const CATEGORY_PAGE_QUERY = `
  *[_type == "category" && slug.current == $slug][0]{
    _id,
    titleTh,
    titleEn,
    excerptTh,
    excerptEn,
    tagsTh,
    tagsEn,
    "imageUrl": image.asset->url,
    "imageAlt": coalesce(image.alt, titleTh, titleEn),
    "products": *[_type == "product" && references(^._id)] | order(isFeatured desc, title asc){
      _id,
      title,
      code,
      summary,
      isFeatured,
      "images": images[]{
        _key,
        "url": asset->url
      },
      "specUrl": specPdf.asset->url
    }
  }
`;

const fetchCategory = cache(async (slug: string | undefined) => {
  if (!slug) {
    return null;
  }
  const data = await client.fetch<CategoryPageData | null>(CATEGORY_PAGE_QUERY, { slug });
  return data;
});

function resolveTitle(category: CategoryPageData) {
  return category.titleTh?.trim() ?? category.titleEn?.trim() ?? "Product Category";
}

function resolveDescription(category: CategoryPageData) {
  return (
    category.excerptTh?.trim() ?? category.excerptEn?.trim() ?? "Discover curated selections of Feel Wood products in this category."
  );
}

type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchCategory(slug);

  if (!category) {
    return {
      title: "หมวดหมู่สินค้า | Feel Wood",
    };
  }

  const title = resolveTitle(category);
  const description = resolveDescription(category);

  return {
    title: `${title} | Feel Wood`,
    description,
    openGraph: {
      title: `${title} | Feel Wood`,
      description,
      images: category.imageUrl ? [{ url: category.imageUrl, alt: category.imageAlt ?? title }] : undefined,
    },
  };
}

export default async function ProductCategoryPage({ params }: RouteParams) {
  const { slug } = await params;
  const category = await fetchCategory(slug);

  if (!category) {
    notFound();
  }

  const title = resolveTitle(category);
  const description = resolveDescription(category);
  const tags =
    (category.tagsTh && category.tagsTh.length > 0
      ? category.tagsTh
      : category.tagsEn) ?? [];
  const products = category.products ?? [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-6 py-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12 lg:py-16">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-500">
              Feel Wood Product Category
            </p>
            <h1 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
              {title}
            </h1>
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">{description}</p>
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          {category.imageUrl ? (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-lg">
              <Image
                src={category.imageUrl}
                alt={category.imageAlt ?? title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 40vw"
                className="object-cover object-center"
                priority
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12 lg:py-16">
        <header className="mb-10 flex flex-col gap-3 text-left sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">สินค้าในหมวดหมู่นี้</h2>
            <p className="text-sm text-slate-500">
              สำรวจรายการสินค้าทั้งหมดที่อยู่ภายใต้หมวดหมู่ {title}
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
          >
            ดูสินค้าทั้งหมด
          </Link>
        </header>

        {products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-8 py-16 text-center text-slate-500">
            ยังไม่มีสินค้าถูกเผยแพร่ในหมวดหมู่นี้
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {products.map((product) => {
              const heroImage = product.images.find((image) => Boolean(image.url));
              return (
                <article
                  key={product._id}
                  className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                    {heroImage?.url ? (
                      <Image
                        src={heroImage.url}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                        className="object-cover transition duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
                        No Image
                      </div>
                    )}
                    {product.isFeatured ? (
                      <div className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                        Featured
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col gap-4 px-6 pb-6 pt-5">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-slate-900">{product.title}</h3>
                      {product.code ? (
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          รหัสสินค้า {product.code}
                        </p>
                      ) : null}
                      {product.summary ? (
                        <p className="text-sm leading-relaxed text-slate-600">{product.summary}</p>
                      ) : null}
                    </div>
                    <div className="mt-auto flex flex-wrap items-center gap-3">
                      {product.specUrl ? (
                        <a
                          href={product.specUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-blue-500 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-500 hover:text-white"
                        >
                          ดาวน์โหลดสเปกสินค้า (PDF)
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
      </main>
    </>
  );
}
