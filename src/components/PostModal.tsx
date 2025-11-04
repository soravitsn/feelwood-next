"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, type ReactNode } from "react";

export type PortableTextSpan = {
  _key: string;
  text?: string;
  marks?: string[];
};

export type PortableTextMarkDef = {
  _key: string;
  _type: string;
  href?: string;
};

export type PortableTextBlock = {
  _key: string;
  _type: string;
  style?: string;
  listItem?: string;
  level?: number;
  children?: PortableTextSpan[];
  markDefs?: PortableTextMarkDef[];
};

export type PostModalData = {
  title: string;
  imageUrl?: string;
  imageAlt?: string;
  imagePriority?: boolean;
  imageUnoptimized?: boolean;
  authorName?: string;
  publishedLabel?: string;
  categories?: string[];
  content?: PortableTextBlock[];
  footerNote?: string;
  shareUrl?: string;
};

type PostModalProps = {
  post: PostModalData;
  onClose: () => void;
  closeAriaLabel: string;
  addBottomPadding?: boolean;
};

const IMAGE_SIZES = "(max-width: 768px) 100vw, (max-width: 1024px) 85vw, 720px";

export function PostModal({
  post,
  onClose,
  closeAriaLabel,
  addBottomPadding = false,
}: PostModalProps) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const resolvedShareUrl = useMemo(() => {
    const rawUrl = post.shareUrl;
    if (!rawUrl) {
      if (typeof window !== "undefined") {
        return window.location.href;
      }
      return "";
    }
    if (/^https?:\/\//i.test(rawUrl)) {
      return rawUrl;
    }
    if (typeof window === "undefined") {
      return rawUrl;
    }
    try {
      return new URL(rawUrl, window.location.origin).toString();
    } catch (error) {
      console.error("Failed to resolve share URL", rawUrl, error);
      return rawUrl;
    }
  }, [post.shareUrl]);

  const shareQuote = post.title;

  const facebookShareHref = resolvedShareUrl
    ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(resolvedShareUrl)}&quote=${encodeURIComponent(shareQuote)}`
    : "";
  const lineShareHref = resolvedShareUrl
    ? `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
        resolvedShareUrl,
      )}&text=${encodeURIComponent(shareQuote)}`
    : "";

  const categoryLabel =
    post.categories && post.categories.length > 0
      ? post.categories.join(" · ")
      : undefined;

  const shouldShowShare = Boolean(resolvedShareUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-10">
      <div className="absolute inset-0 z-0" onClick={onClose} aria-hidden />
      <div
        className="relative z-10 w-full max-w-4xl"
        role="dialog"
        aria-modal="true"
        aria-label={post.title}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-500 transition-colors hover:border-blue-400 hover:bg-blue-100 hover:text-blue-700 sm:-right-14 sm:top-1/2 sm:-translate-y-1/2 sm:bg-white sm:shadow-lg"
          aria-label={closeAriaLabel}
        >
          x
        </button>
        <div className="max-h-[85vh] overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="flex max-h-[85vh] flex-col gap-6 overflow-y-auto [scrollbar-gutter:stable] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:hover:bg-slate-400">
            <div className="flex flex-col bg-white px-4 pt-4">
              <figure className="relative h-[260px] w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-[320px] lg:h-[380px]">
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.imageAlt ?? post.title}
                    fill
                    sizes={IMAGE_SIZES}
                    className="object-cover"
                    priority={post.imagePriority}
                    unoptimized={post.imageUnoptimized}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-200 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                    {post.title.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </figure>
            </div>
            <div
              className={`flex min-h-0 min-w-0 flex-1 flex-col gap-5 px-6 ${
                addBottomPadding ? "pb-12" : "pb-8"
              } sm:px-8`}
            >
              <div className="space-y-2 text-center sm:text-left">
                {post.publishedLabel ? (
                  <p className="text-xs font-medium uppercase tracking-[0.3em] text-blue-500">
                    {post.publishedLabel}
                  </p>
                ) : null}
                <h2 className="text-2xl font-semibold text-slate-900">{post.title}</h2>
                {post.authorName ? (
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    By {post.authorName}
                  </p>
                ) : null}
                {categoryLabel ? (
                  <p className="text-xs text-slate-400">{categoryLabel}</p>
                ) : null}
              </div>
              <div className="space-y-4 pb-6 text-left">
                {renderPortableText(post.content)}
              </div>
              {shouldShowShare ? (
                <div
                  className={`flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between ${
                    addBottomPadding ? "pb-4" : ""
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    แชร์บทความ
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={facebookShareHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-blue-400 hover:text-blue-600"
                      aria-label="แชร์บทความนี้ลง Facebook"
                    >
                      แชร์ลง Facebook
                    </a>
                    <a
                      href={lineShareHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-green-400 hover:text-green-600"
                      aria-label="แชร์บทความนี้ลง LINE"
                    >
                      แชร์ลง LINE
                    </a>
                  </div>
                </div>
              ) : null}
              {post.footerNote ? (
                <div
                  className={`flex flex-wrap items-baseline justify-between gap-3 pb-3 ${
                    shouldShowShare ? "" : "border-t border-slate-100 pt-4"
                  } ${addBottomPadding ? "pb-6" : ""}`}
                >
                  <p className="text-xs text-slate-400">{post.footerNote}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderPortableText(blocks?: PortableTextBlock[]): ReactNode {
  if (!blocks || blocks.length === 0) {
    return <p className="text-sm text-slate-500">ยังไม่มีเนื้อหาในบทความนี้</p>;
  }

  const elements: ReactNode[] = [];
  let currentListType: "ul" | "ol" | null = null;
  let currentListItems: ReactNode[] = [];
  let currentListKey: string | null = null;

  const flushList = () => {
    if (currentListType && currentListItems.length > 0 && currentListKey) {
      if (currentListType === "ol") {
        elements.push(
          <ol
            key={currentListKey}
            className="ml-6 list-decimal space-y-2 text-left text-sm leading-relaxed text-slate-700"
          >
            {currentListItems}
          </ol>,
        );
      } else {
        elements.push(
          <ul
            key={currentListKey}
            className="ml-6 list-disc space-y-2 text-left text-sm leading-relaxed text-slate-700"
          >
            {currentListItems}
          </ul>,
        );
      }
    }
    currentListType = null;
    currentListItems = [];
    currentListKey = null;
  };

  blocks.forEach((block) => {
    if (block._type !== "block" || !block.children) {
      flushList();
      return;
    }

    if (!block.children.some((span) => (span.text ?? "").trim().length > 0)) {
      return;
    }

    const markDefs = block.markDefs;
    const renderSpan = (span: PortableTextSpan): ReactNode => {
      const baseContent = span.text ?? "";

      if (!span.marks || span.marks.length === 0) {
        return baseContent;
      }

      return span.marks.reduceRight<ReactNode>((acc, mark) => {
        if (mark === "strong") {
          return (
            <strong key={`${span._key}-strong`} className="font-semibold">
              {acc}
            </strong>
          );
        }

        if (mark === "em") {
          return (
            <em key={`${span._key}-em`} className="italic">
              {acc}
            </em>
          );
        }

        const def = markDefs?.find((item) => item._key === mark);
        if (def && def._type === "link" && def.href) {
          return (
            <Link
              key={`${span._key}-${mark}`}
              href={def.href}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-blue-400 decoration-2 underline-offset-4 transition hover:text-blue-600"
            >
              {acc}
            </Link>
          );
        }

        return acc;
      }, baseContent);
    };

    const inlineContent = block.children.map((span) => renderSpan(span));

    if (block.listItem) {
      const listType = block.listItem === "number" ? "ol" : "ul";
      if (currentListType !== listType) {
        flushList();
        currentListType = listType;
        currentListKey = `list-${block._key}`;
      }
      currentListItems.push(
        <li key={block._key} className="pl-1 text-sm leading-relaxed text-slate-700">
          {inlineContent}
        </li>,
      );
      return;
    }

    flushList();

    if (block.style === "blockquote") {
      elements.push(
        <blockquote
          key={block._key}
          className="border-l-4 border-blue-200 bg-blue-50 px-4 py-2 text-sm italic leading-relaxed text-slate-700"
        >
          {inlineContent}
        </blockquote>,
      );
      return;
    }

    switch (block.style) {
      case "h2":
        elements.push(
          <h2 key={block._key} className="text-xl font-semibold text-slate-900">
            {inlineContent}
          </h2>,
        );
        return;
      case "h3":
        elements.push(
          <h3 key={block._key} className="text-lg font-semibold text-slate-900">
            {inlineContent}
          </h3>,
        );
        return;
      case "h4":
        elements.push(
          <h4 key={block._key} className="text-base font-semibold text-slate-900">
            {inlineContent}
          </h4>,
        );
        return;
      default:
        elements.push(
          <p key={block._key} className="text-sm leading-relaxed text-slate-700">
            {inlineContent}
          </p>,
        );
    }
  });

  flushList();

  return elements;
}
