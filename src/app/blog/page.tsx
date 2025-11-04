"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  PostModal,
  type PortableTextBlock,
  type PostModalData,
} from "@/components/PostModal";
import { Navbar } from "@/components/Navbar";
import { client } from "@/lib/sanity.client";

type SanityPost = {
  _id: string;
  titleTh?: string;
  titleEn?: string;
  excerptTh?: string;
  excerptEn?: string;
  contentTh?: PortableTextBlock[];
  contentEn?: PortableTextBlock[];
  publishedAt?: string;
  slug?: string | null;
  authorName?: string;
  categories?: Array<{
    _id: string;
    titleTh?: string;
    titleEn?: string;
  }>;
  coverImage?: {
    alt?: string;
    url?: string;
  };
};

const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc){
  _id,
  titleTh,
  titleEn,
  excerptTh,
  excerptEn,
  contentTh,
  contentEn,
  publishedAt,
  "slug": slug.current,
  "authorName": author->name,
  "coverImage": coverImage{
    alt,
    "url": asset->url
  },
  "categories": categories[]->{
    _id,
    titleTh,
    titleEn
  }
}`;

function formatDate(isoString?: string) {
  if (!isoString) return "";
  try {
    return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(
      new Date(isoString),
    );
  } catch (error) {
    console.error("Failed to format date", isoString, error);
    return "";
  }
}

function resolveTitle(post: SanityPost) {
  return post.titleTh?.trim() ?? post.titleEn?.trim() ?? "บทความไม่มีชื่อ";
}

function resolveExcerpt(post: SanityPost) {
  return (
    post.excerptTh?.trim() ??
    post.excerptEn?.trim() ??
    "ยังไม่มีคำอธิบายสำหรับบทความนี้"
  );
}

function resolveContent(post: SanityPost) {
  return post.contentTh && post.contentTh.length > 0
    ? post.contentTh
    : post.contentEn;
}

function mapPostToModalData(post: SanityPost): PostModalData {
  const title = resolveTitle(post);
  const categories = (post.categories ?? [])
    .map((category) => category.titleTh?.trim() ?? category.titleEn?.trim())
    .filter((value): value is string => Boolean(value));

  return {
    title,
    imageUrl: post.coverImage?.url ?? undefined,
    imageAlt: post.coverImage?.alt ?? title,
    imagePriority: true,
    imageUnoptimized: true,
    authorName: post.authorName?.trim() || undefined,
    publishedLabel: formatDate(post.publishedAt) || "ยังไม่ระบุวันที่เผยแพร่",
    categories,
    content: resolveContent(post),
    shareUrl: post.slug ? `/blog/${post.slug}` : undefined,
  };
}


function BlogIndexPageContent() {
  const [posts, setPosts] = useState<SanityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<SanityPost | null>(null);
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      try {
        setIsLoading(true);
        const result = await client.fetch<SanityPost[]>(POSTS_QUERY);
        if (!isMounted) return;
        setPosts(result);
        setErrorMessage(null);
      } catch (error) {
        console.error("Failed to load posts", error);
        if (isMounted) {
          setErrorMessage("ไม่สามารถโหลดบทความได้ กรุณาลองใหม่อีกครั้ง");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const visiblePosts = useMemo(
    () => posts.filter((post) => Boolean(post.slug)),
    [posts],
  );

  useEffect(() => {
    const updatePageSize = () => {
      if (typeof window === "undefined") {
        return;
      }
      const nextSize = window.innerWidth < 640 ? 4 : 6;
      setPageSize((prev) => (prev === nextSize ? prev : nextSize));
    };

    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  useEffect(() => {
    const maxPage = Math.max(
      1,
      Math.ceil(visiblePosts.length / (pageSize > 0 ? pageSize : 1)),
    );
    setCurrentPage((prev) => Math.min(prev, maxPage));
  }, [visiblePosts.length, pageSize]);

  const totalPages = Math.max(
    1,
    Math.ceil(visiblePosts.length / (pageSize > 0 ? pageSize : 1)),
  );

  const paginatedPosts =
    pageSize > 0
      ? visiblePosts.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize,
        )
      : visiblePosts;

  const modalPost = selectedPost ? mapPostToModalData(selectedPost) : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-6 pt-10 pb-16 sm:pt-12">
        <header className="mb-10 flex flex-col gap-3 text-center sm:mb-12">
          <p className="text-sm uppercase tracking-[0.4em] text-blue-500">
            Feel Wood Insights
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            เรียนรู้เทคนิคการออกแบบด้วยวัสดุไม้สมัยใหม่
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg">
            รวบรวมเคสจริงและไอเดียจากทีม Feel Wood เพื่อยกระดับพื้นที่ด้วย SPC
            Flooring, WPC Wall Panel, Stone Veneer และงานไม้สั่งทำ
          </p>
        </header>

        {isLoading ? (
          <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-56 animate-pulse rounded-3xl border border-slate-200 bg-white/60"
              />
            ))}
          </section>
        ) : errorMessage ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-5 text-center text-sm text-red-600">
            {errorMessage}
          </div>
        ) : visiblePosts.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-500">
            ยังไม่มีบทความเผยแพร่ในขณะนี้
          </div>
        ) : (
          <section className="grid gap-8 text-left sm:grid-cols-2 lg:grid-cols-3">
            {paginatedPosts.map((post) => (
              <article
                key={post._id}
                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/80 shadow-sm transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                tabIndex={0}
                role="button"
                onClick={() => setSelectedPost(post)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedPost(post);
                  }
                }}
              >
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  {post.coverImage?.url ? (
                    <Image
                      src={post.coverImage.url}
                      alt={post.coverImage.alt || resolveTitle(post)}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-200 text-xs text-slate-500">
                      ไม่มีภาพหน้าปก
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-[0.3em] text-blue-500">
                      {formatDate(post.publishedAt) || "ไม่ระบุวันที่"}
                    </p>
                    <h2 className="text-xl font-semibold leading-tight text-slate-900">
                      {resolveTitle(post)}
                    </h2>
                  </div>
                  <p className="text-sm text-slate-600">{resolveExcerpt(post)}</p>
                  {post.categories && post.categories.length > 0 && (
                    <p className="text-xs text-slate-400">
                      {post.categories
                        .map(
                          (category) =>
                            category.titleTh ?? category.titleEn ?? undefined,
                        )
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-blue-600 group-hover:text-blue-500">
                    อ่านต่อ
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </article>
            ))}
          </section>
        )}

        {visiblePosts.length > 0 && totalPages > 1 && (
          <nav
            aria-label="การแบ่งหน้าโพสต์"
            className="mt-10 flex flex-col items-center gap-4 text-sm text-slate-500 sm:flex-row sm:justify-between"
          >
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 font-medium text-slate-600 transition hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
            >
              ← ก่อนหน้า
            </button>

            <div className="flex items-center gap-2">
              <span>หน้า</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                {currentPage}
              </span>
              <span>จาก</span>
              <span className="font-medium text-slate-700">{totalPages}</span>
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 font-medium text-slate-600 transition hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
            >
              ถัดไป →
            </button>
          </nav>
        )}

        <footer className="mt-16 flex flex-col items-center gap-3 text-center text-sm text-slate-500 sm:flex-row sm:justify-between">
          <span>ติดตามอัปเดตสินค้าและบทความใหม่ผ่านอีเมลของคุณ</span>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-blue-500 px-5 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-500 hover:text-white"
          >
            ติดต่อเรา
          </Link>
        </footer>
      </main>

      {modalPost && (
        <PostModal
          post={modalPost}
          onClose={() => setSelectedPost(null)}
          closeAriaLabel="ปิดหน้าต่างบทความ"
          addBottomPadding
        />
      )}
    </div>
  );
}

export default function BlogIndexPage() {
  return <BlogIndexPageContent />;
}
