import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    // 🔹 ชื่อหมวด
    defineField({
      name: 'titleTh',
      title: 'ชื่อหมวด (ภาษาไทย)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleEn',
      title: 'ชื่อหมวด (ภาษาอังกฤษ)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // 🔹 Slug (ใช้ภาษาอังกฤษสำหรับ URL)
    defineField({
      name: 'slug',
      title: 'Slug (สำหรับ URL)',
      type: 'slug',
      options: {
        source: 'titleEn',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    // 🔹 คำอธิบายสั้น
    defineField({
      name: 'excerptTh',
      title: 'คำอธิบายสั้น (ไทย)',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'excerptEn',
      title: 'Short Description (English)',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(200),
    }),

    // 🔹 Tag (ภาษาไทย / อังกฤษ)
    defineField({
      name: 'tagsTh',
      title: 'แท็ก (ภาษาไทย)',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'tagsEn',
      title: 'Tags (English)',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),

    // 🔹 รูปภาพ
    defineField({
      name: 'image',
      title: 'ภาพประกอบหมวด',
      type: 'image',
      options: { hotspot: true },
      description: 'ใช้สำหรับหน้าแสดงหมวดสินค้า (1200×800px)',
    }),
  ],

  preview: {
    select: {
      title: 'titleTh',
      subtitle: 'titleEn',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle,
        media,
      }
    },
  },
})
