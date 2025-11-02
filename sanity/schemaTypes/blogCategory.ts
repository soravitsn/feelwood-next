import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'blogCategory',
  title: 'Blog Category',
  type: 'document',
  fields: [
    defineField({ name: 'titleTh', title: 'ชื่อหมวด (ไทย)', type: 'string', validation: r => r.required() }),
    defineField({ name: 'titleEn', title: 'Category (EN)', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'titleEn', maxLength: 96 },
      validation: r => r.required(),
    }),
  ],
  preview: { select: { title: 'titleTh', subtitle: 'titleEn' } },
})
