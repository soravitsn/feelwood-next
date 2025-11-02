# 🪵 FeelWood Website - Schema & Sitemap Overview

This document summarizes the **Sanity CMS schema types** and the **Next.js sitemap structure**
for the FeelWood furniture website project.

---

## 🧩 1. Sanity Schema Structure

### **Product**
Used to store furniture product information.

| Field | Type | Description |
|-------|------|--------------|
| `title` | `string` | Product name |
| `slug` | `slug` | Auto-generated URL slug from title |
| `code` | `string` | Product code (e.g., PVC-001) |
| `summary` | `text` | Short product summary |
| `description` | `text` | Full product description |
| `image` | `image` | Main product image |
| `gallery` | `array of images` | Optional product gallery |
| `category` | `reference` | Reference to `Category` |
| `price` | `number` | Optional retail price |
| `featured` | `boolean` | Mark as featured product |
| `createdAt` | `datetime` | Auto-generated timestamp |

---

### **Category**
Used to group products by furniture type.

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Category name (e.g., PVC Doors, Solid Wood) |
| `slug` | `slug` | Auto-generated slug |
| `description` | `text` | Optional category description |
| `image` | `image` | Category cover image |

---

### **Blog**
For editorial or informational posts.

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Blog title |
| `slug` | `slug` | Auto slug from title |
| `excerpt` | `text` | Short summary for listing |
| `content` | `blockContent` | Full blog body (rich text) |
| `coverImage` | `image` | Hero image for the post |
| `publishedAt` | `datetime` | Publication date |
| `author` | `string` | Optional author name |

---

### **Project / Portfolio**
For showing completed design or furnishing projects.

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Project title |
| `slug` | `slug` | Auto slug from title |
| `summary` | `text` | Short description |
| `images` | `array of image` | Project image gallery |
| `location` | `string` | Project location |
| `category` | `reference` | Related category |
| `year` | `number` | Completion year |

---

### **Promotion**
For homepage banner or campaign sections.

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Promotion name |
| `image` | `image` | Banner or visual |
| `description` | `text` | Short description |
| `ctaText` | `string` | Button text (e.g., "Shop Now") |
| `ctaLink` | `url` | Button link |
| `active` | `boolean` | Toggle visibility |

---

## 🗺️ 2. Sitemap Structure (Next.js)

| Route | Page | Description |
|-------|------|-------------|
| `/` | `Home` | Landing page showing hero, about, featured products, promotions |
| `/products` | `Products` | All product listing fetched from Sanity |
| `/products/[slug]` | `ProductDetail` | Dynamic page for each product |
| `/categories` | `Categories` | List of product categories |
| `/categories/[slug]` | `CategoryDetail` | Shows products under each category |
| `/projects` | `Projects / Portfolio` | Completed projects display |
| `/blog` | `Blog` | Blog list page |
| `/blog/[slug]` | `BlogPost` | Blog detail page |
| `/about` | `About Us` | Company profile and team section |
| `/contact` | `Contact` | Contact info and inquiry form |
