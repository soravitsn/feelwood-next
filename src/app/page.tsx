"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { PostModal, type PortableTextBlock } from "@/components/PostModal";
import { Navbar } from "@/components/Navbar";
import { client } from "@/lib/sanity.client";

type RawCategory = {
  _id: string;
  titleTh?: string;
  titleEn?: string;
  excerptTh?: string;
  excerptEn?: string;
  slug?: string | null;
  imageUrl?: string | null;
};

type CategoryCard = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  slug: string;
  imageUrl?: string;
};

type PostCategory = {
  _id: string;
  titleTh?: string;
  titleEn?: string;
};

type RawPost = {
  _id: string;
  titleTh?: string;
  titleEn?: string;
  excerptTh?: string;
  excerptEn?: string;
  slug?: string | null;
  coverImage?: {
    url?: string | null;
    alt?: string | null;
  } | null;
  publishedAt?: string;
  authorName?: string;
  categories?: PostCategory[];
  contentTh?: PortableTextBlock[];
  contentEn?: PortableTextBlock[];
};

type IndexUpdater = number | ((prev: number) => number);

type PostCard = {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  imageUrl?: string;
  imageAlt?: string;
  publishedLabel?: string;
  publishedAt?: string;
  authorName?: string;
  categories: string[];
  content?: PortableTextBlock[];
};

function formatDate(isoString?: string) {
  if (!isoString) return "";
  try {
    return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(isoString));
  } catch (error) {
    console.error("Failed to format date", isoString, error);
    return "";
  }
}

function resolveTitle(post: RawPost) {
  return post.titleTh?.trim() ?? post.titleEn?.trim() ?? "บทความ";
}

function resolveExcerpt(post: RawPost) {
  return (
    post.excerptTh?.trim() ??
    post.excerptEn?.trim() ??
    "ติดตามข้อมูลและแรงบันดาลใจจากทีม Feel Wood"
  );
}

function resolveContent(post: RawPost) {
  return post.contentTh && post.contentTh.length > 0 ? post.contentTh : post.contentEn;
}

const CATEGORY_QUERY = `*[_type == "category"] | order(titleTh asc){
  _id,
  titleTh,
  titleEn,
  excerptTh,
  excerptEn,
  "slug": slug.current,
  "imageUrl": image.asset->url
}`;

const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc)[0...9]{
  _id,
  titleTh,
  titleEn,
  excerptTh,
  excerptEn,
  contentTh,
  contentEn,
  "slug": slug.current,
  publishedAt,
  "authorName": author->name,
  "categories": categories[]->{
    _id,
    titleTh,
    titleEn
  },
  "coverImage": {
    "url": coverImage.asset->url,
    "alt": coalesce(coverImage.alt, titleTh, titleEn)
  }
}`;

const HERO_SLIDES = [
  {
    id: "nature-living",
    image: "/images/hero1.jpg",
    eyebrow: "Handcrafted Woodwork",
    heading: "นำธรรมชาติเข้ามาใกล้ชีวิตประจำวัน",
    body: "เลือกวัสดุไม้แท้คุณภาพ พร้อมงานตกแต่งที่ออกแบบพิเศษสำหรับบ้านและธุรกิจของคุณ",
    ctaLabel: "ดูสินค้าล่าสุด",
    ctaHref: "/products",
  },
  {
    id: "tailor-made",
    image: "/images/hero2.jpg",
    eyebrow: "Custom Made",
    heading: "ออกแบบเฟอร์นิเจอร์จากไอเดียของคุณ",
    body: "ทีมงาน Feel Wood สร้างสรรค์ผลงานใหม่จากแรงบันดาลใจของคุณ ทุกชิ้นงานมีเรื่องราว",
    ctaLabel: "เริ่มต้นปรึกษาทีมเรา",
    ctaHref: "/contact",
  },
  {
    id: "sustainable",
    image: "/images/hero3.jpg",
    eyebrow: "Sustainable Materials",
    heading: "ไม้ทุกชิ้นผ่านการคัดสรรอย่างรับผิดชอบ",
    body: "รับประกันที่มาและมาตรฐานของไม้ เพื่อสร้างสรรค์พื้นที่ที่สวยและยั่งยืน",
    ctaLabel: "ทำความรู้จัก Feel Wood",
    ctaHref: "/about",
  },
];

const HERO_AUTOPLAY_INTERVAL = 8000;
const POST_ROTATE_INTERVAL = 9000;
const POST_FADE_DURATION = 500;

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [categories, setCategories] = useState<CategoryCard[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [posts, setPosts] = useState<PostCard[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [activePostIndex, setActivePostIndex] = useState(0);
  const [isPostFading, setIsPostFading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostCard | null>(null);
  const slideCount = HERO_SLIDES.length;
  const fadeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slideCount);
    }, HERO_AUTOPLAY_INTERVAL);

    return () => window.clearInterval(timer);
  }, [slideCount]);

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        setIsLoadingCategories(true);
        const data = await client.fetch<RawCategory[]>(CATEGORY_QUERY);

        if (!isMounted) return;

        const mapped = data
          .filter((category) => category.slug)
          .map<CategoryCard>((category) => ({
            id: category._id,
            title: category.titleTh?.trim() ?? category.titleEn?.trim() ?? "หมวดหมู่",
            subtitle: category.titleEn?.trim(),
            description:
              category.excerptTh?.trim() ?? category.excerptEn?.trim() ?? "หมวดหมู่สินค้า Feel Wood",
            slug: category.slug as string,
            imageUrl: category.imageUrl ?? undefined,
          }));

        setCategories(mapped);
      } catch (error) {
        console.error("Failed to load categories for homepage:", error);
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

  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      try {
        setIsLoadingPosts(true);
        const data = await client.fetch<RawPost[]>(POSTS_QUERY);

        if (!isMounted) return;

        const formatter = new Intl.DateTimeFormat("th-TH", {
          dateStyle: "medium",
        });

        const mapped = data
          .filter((post) => post.slug)
          .map<PostCard>((post) => {
            const title = resolveTitle(post);
            const excerpt = resolveExcerpt(post);
            const contentBlocks = resolveContent(post);
            const categoryTitles = (post.categories ?? [])
              .map((category) => category.titleTh?.trim() ?? category.titleEn?.trim())
              .filter((value): value is string => Boolean(value));

            return {
              id: post._id,
              title,
              excerpt,
              slug: post.slug as string,
              imageUrl: post.coverImage?.url ?? undefined,
              imageAlt: post.coverImage?.alt ?? title,
              publishedAt: post.publishedAt ?? undefined,
              publishedLabel: post.publishedAt
                ? formatter.format(new Date(post.publishedAt))
                : undefined,
              authorName: post.authorName?.trim(),
              categories: categoryTitles,
              content: contentBlocks,
            };
          });

        setPosts(mapped);
        setActivePostIndex(0);
        setSelectedPost(null);
      } catch (error) {
        console.error("Failed to load posts for homepage:", error);
      } finally {
        if (isMounted) {
          setIsLoadingPosts(false);
        }
      }
    }

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  const heroSlides = useMemo(() => HERO_SLIDES, []);
  const rotatingPosts = useMemo(() => {
    if (posts.length === 0) return [];
    const visibleCount = Math.min(4, posts.length);
    const items: PostCard[] = [];
    for (let offset = 0; offset < visibleCount; offset += 1) {
      const index = (activePostIndex + offset) % posts.length;
      items.push(posts[index]);
    }
    return items;
  }, [posts, activePostIndex]);
  const featuredPost = rotatingPosts[0] ?? null;
  const supportingPosts = rotatingPosts.slice(1);

  const totalPosts = posts.length;

  const schedulePostChange = useCallback(
    (updater: IndexUpdater) => {
      if (totalPosts === 0) {
        return;
      }
      if (fadeTimeoutRef.current !== null) {
        window.clearTimeout(fadeTimeoutRef.current);
      }
      setIsPostFading(true);
      fadeTimeoutRef.current = window.setTimeout(() => {
        setActivePostIndex((prev) => {
          const rawNext =
            typeof updater === "function"
              ? (updater as (prev: number) => number)(prev)
              : updater;
          const normalized = ((rawNext % totalPosts) + totalPosts) % totalPosts;
          return normalized;
        });
        setIsPostFading(false);
        fadeTimeoutRef.current = null;
      }, POST_FADE_DURATION);
    },
    [totalPosts],
  );

  const handleOpenPost = (post: PostCard) => {
    const index = posts.findIndex((item) => item.id === post.id);
    if (index !== -1) {
      schedulePostChange(index);
    }
    setSelectedPost(post);
  };

  const closePostModal = () => {
    setSelectedPost(null);
  };

  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current !== null) {
        window.clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedPost || totalPosts <= 1) return;

    const interval = window.setInterval(() => {
      schedulePostChange((prev) => prev + 1);
    }, POST_ROTATE_INTERVAL);

    return () => window.clearInterval(interval);
  }, [schedulePostChange, selectedPost, totalPosts]);

  const modalPost = selectedPost
    ? {
        title: selectedPost.title,
        imageUrl: selectedPost.imageUrl,
        imageAlt: selectedPost.imageAlt,
        imagePriority: true,
        authorName: selectedPost.authorName,
        publishedLabel: selectedPost.publishedLabel,
        categories: selectedPost.categories,
        content: selectedPost.content,
        shareUrl: `/blog/${selectedPost.slug}`,
        footerNote: selectedPost.publishedAt
          ? `เผยแพร่เมื่อ ${formatDate(selectedPost.publishedAt)}`
          : undefined,
      }
    : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main>
        <section className="mx-auto mt-6 w-full max-w-6xl px-6">
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-2xl">
            <div className="relative h-[420px] sm:h-[460px] md:h-[520px]">
              {heroSlides.map((slide, index) => (
                <article
                  key={slide.id}
                  className={`absolute inset-0 flex transition-opacity duration-700 ease-out ${
                    index === activeSlide ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                  aria-hidden={index !== activeSlide}
                >
                  <Image
                    src={slide.image}
                    alt={slide.heading}
                    fill
                    priority={index === 0}
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/65 to-transparent" />
                  <div className="relative z-10 flex w-full flex-col justify-between gap-12 p-8 sm:p-10 md:p-14 lg:max-w-xl">
                    <div className="space-y-4">
                      <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm font-medium uppercase tracking-[0.15em]">
                        {slide.eyebrow}
                      </span>
                      <h1 className="text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                        {slide.heading}
                      </h1>
                      <p className="text-base text-slate-200 sm:text-lg">{slide.body}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={slide.ctaHref}
                        className="inline-flex items-center justify-center rounded-full bg-white/90 px-6 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
                      >
                        {slide.ctaLabel}
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="absolute bottom-6 left-0 z-20 hidden w-full items-center justify-center px-6 md:flex">
              <div className="flex items-center gap-3 rounded-full border border-white/30 bg-slate-900/50 px-4 py-2 shadow-lg backdrop-blur">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeSlide ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/60"
                    }`}
                    onClick={() => goToSlide(index)}
                    aria-label={`เปิดสไลด์หมายเลข ${index + 1}`}
                    aria-current={index === activeSlide}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center md:hidden">
            <div className="flex items-center gap-3 rounded-full border border-slate-300 bg-white/70 px-4 py-2 shadow-sm backdrop-blur">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  className={`h-2 rounded-full transition-all ${
                    index === activeSlide
                      ? "w-6 bg-slate-900"
                      : "w-2 bg-slate-400 hover:bg-slate-500"
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`เปิดสไลด์หมายเลข ${index + 1}`}
                  aria-current={index === activeSlide}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-16 w-full max-w-6xl px-6">
          <header className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">
              Our Product
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
              สำรวจหมวดหมู่สินค้าที่หลากหลายจาก Feel Wood
            </h2>
            <p className="mt-3 max-w-2xl text-center text-slate-600 sm:mx-auto">
              เลือกชมสินค้าตามความต้องการ ตั้งแต่เฟอร์นิเจอร์ตกแต่งภายในไปจนถึงโปรเจ็กต์งานไม้ขนาดใหญ่
            </p>
          </header>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoadingCategories ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`category-skeleton-${index}`}
                  className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="mb-4 h-40 rounded-xl bg-slate-200" />
                  <div className="mb-2 h-5 w-3/4 rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-200" />
                  <div className="mt-4 h-3 w-1/2 rounded bg-slate-200" />
                </div>
              ))
            ) : categories.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
                ยังไม่มีหมวดหมู่สินค้าในระบบ ขณะนี้ทีมกำลังอัปเดตข้อมูล
              </div>
            ) : (
              categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products/${category.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-blue-400"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt={category.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                        {category.title.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-3 px-5 pb-6 pt-5">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                        {category.subtitle}
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-slate-900">{category.title}</h3>
                    </div>
                    <p className="line-clamp-3 text-sm text-slate-600">{category.description}</p>
                    <span className="mt-auto inline-flex items-center text-sm font-semibold text-blue-600 transition group-hover:translate-x-1">
                      ดูรายละเอียด
                      <span className="ml-1" aria-hidden>
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="mx-auto mt-16 w-full max-w-6xl px-6 pb-20">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <header className="flex h-full flex-col justify-between gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
                  อัปเดตจากบล็อก Feel Wood
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  เก็บเกี่ยวแรงบันดาลใจ เทคนิคงานออกแบบ และเรื่องราวจากโปรเจ็กต์ล่าสุดของเรา
                </p>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-full border border-blue-500 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-500 hover:text-white"
              >
                ดูบทความทั้งหมด
              </Link>
            </header>

            <div
              className={`mt-6 grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] transition-opacity duration-500 ${
                isPostFading ? "opacity-0" : "opacity-100"
              }`}
            >
              {isLoadingPosts ? (
                <>
                  <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                    <div className="h-48 w-full bg-slate-200 sm:h-56" />
                    <div className="space-y-2 px-5 pb-6 pt-5">
                      <div className="h-5 w-32 rounded bg-slate-200" />
                      <div className="h-5 w-3/4 rounded bg-slate-200" />
                      <div className="space-y-2">
                        <div className="h-4 w-full rounded bg-slate-200" />
                        <div className="h-4 w-5/6 rounded bg-slate-200" />
                        <div className="h-4 w-1/2 rounded bg-slate-200" />
                      </div>
                    </div>
                  </div>
                  <div className="flex h-full flex-col justify-between gap-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={`post-skeleton-side-${index}`}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm"
                      >
                        <div className="h-20 w-20 rounded-xl bg-slate-200 sm:h-20 sm:w-20" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-24 rounded bg-slate-200" />
                          <div className="h-4 w-3/4 rounded bg-slate-200" />
                          <div className="h-4 w-5/6 rounded bg-slate-200" />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : rotatingPosts.length === 0 ? (
                <div className="md:col-span-2">
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-slate-500">
                    ยังไม่มีบทความเผยแพร่ในขณะนี้
                  </div>
                </div>
              ) : (
                <>
                  {featuredPost && (
                    <article
                      className="group flex h-full min-h-[320px] cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-blue-400"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleOpenPost(featuredPost)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handleOpenPost(featuredPost);
                        }
                      }}
                      aria-label={`เปิดบทความ ${featuredPost.title}`}
                    >
                      <div className="relative h-52 w-full overflow-hidden bg-slate-100 sm:h-60">
                        {featuredPost.imageUrl ? (
                          <Image
                            src={featuredPost.imageUrl}
                            alt={featuredPost.imageAlt ?? featuredPost.title}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 50vw"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                            {featuredPost.title.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-3 px-5 pb-6 pt-5">
                        {featuredPost.publishedLabel ? (
                          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-500">
                            {featuredPost.publishedLabel}
                          </p>
                        ) : null}
                        <h4 className="text-xl font-semibold leading-tight text-slate-900 sm:text-2xl">
                          {featuredPost.title}
                        </h4>
                        <p className="line-clamp-3 text-sm text-slate-600">
                          {featuredPost.excerpt}
                        </p>
                      </div>
                    </article>
                  )}
                  <div className="flex h-full flex-col justify-between gap-3">
                    {supportingPosts.length === 0 ? (
                      <div className="flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center text-sm text-slate-500">
                        บทความอื่น ๆ กำลังอยู่ในระหว่างการจัดเตรียม
                      </div>
                    ) : (
                      supportingPosts.map((post) => (
                        <article
                          key={post.id}
                          className="group flex h-full cursor-pointer items-stretch gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-blue-400"
                          role="button"
                          tabIndex={0}
                          onClick={() => handleOpenPost(post)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              handleOpenPost(post);
                            }
                          }}
                          aria-label={`เปิดบทความ ${post.title}`}
                        >
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-20 sm:w-20">
                            {post.imageUrl ? (
                              <Image
                                src={post.imageUrl}
                                alt={post.imageAlt ?? post.title}
                                fill
                                className="object-cover transition duration-500 group-hover:scale-105"
                                sizes="120px"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                                {post.title.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-1 flex-col justify-between gap-2">
                            {post.publishedLabel ? (
                              <p className="text-xs font-medium uppercase tracking-[0.25em] text-blue-500">
                                {post.publishedLabel}
                              </p>
                            ) : null}
                            <h5 className="text-base font-semibold leading-snug text-slate-900 sm:text-lg">
                              {post.title}
                            </h5>
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {modalPost ? (
        <PostModal post={modalPost} onClose={closePostModal} closeAriaLabel="ปิดหน้าต่างบทความ" />
      ) : null}
    </div>
  );
}
