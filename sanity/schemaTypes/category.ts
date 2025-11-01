import {defineType, defineField} from 'sanity'
export default defineType({
  name: 'category', title: 'Categories', type: 'document',
  fields: [
    defineField({name: 'name', title: 'ชื่อหมวด', type: 'string', validation: r=>r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options:{source:'name', maxLength:96}})
  ]
})
