import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    // ชื่อเรื่อง
    defineField({ name: 'titleTh', title: 'หัวข้อ (ไทย)', type: 'string', validation: r => r.required() }),
    defineField({ name: 'titleEn', title: 'Title (EN)', type: 'string', validation: r => r.required() }),

    // Slug (ยึด EN เพื่อความเรียบร้อยของ URL)
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'titleEn', maxLength: 96 },
      validation: r => r.required(),
    }),

    // คำโปรย
    defineField({ name: 'excerptTh', title: 'คำโปรย (ไทย)', type: 'text', rows: 3 }),
    defineField({ name: 'excerptEn', title: 'Excerpt (EN)', type: 'text', rows: 3 }),

    // เนื้อหา (rich text)
    defineField({ name: 'contentTh', title: 'เนื้อหา (ไทย)', type: 'richText' }),
    defineField({ name: 'contentEn', title: 'Content (EN)', type: 'richText' }),

    // เมตาอื่นๆ
    defineField({ name: 'coverImage', title: 'ภาพปก', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'author', title: 'Author', type: 'reference', to: [{ type: 'author' }] }),
    defineField({
      name: 'categories',
      title: 'หมวดบล็อก',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'blogCategory' }] }],
    }),
    defineField({ name: 'tagsTh', title: 'แท็ก (ไทย)', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'tagsEn', title: 'Tags (EN)', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'publishedAt', title: 'เผยแพร่เมื่อ', type: 'datetime', validation: r => r.required() }),
    defineField({ name: 'isFeatured', title: 'Featured', type: 'boolean', initialValue: false }),

    // SEO (ทางเลือก)
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text' }),
  ],
  orderings: [
    { title: 'Publish date, new → old', name: 'publishDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'titleTh', subtitle: 'titleEn', media: 'coverImage' },
    prepare({ title, subtitle, media }) {
      return { title, subtitle, media }
    },
  },
})
