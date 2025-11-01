import {defineType, defineField} from 'sanity'
export default defineType({
  name: 'product', title: 'Products', type: 'document',
  fields: [
    defineField({name:'title', title:'ชื่อสินค้า', type:'string', validation:r=>r.required()}),
    defineField({name:'code', title:'รหัสสินค้า', type:'string'}),
    defineField({name:'category', title:'หมวด', type:'reference', to:[{type:'category'}]}),
    defineField({name:'summary', title:'คำอธิบายสั้น', type:'text'}),
    defineField({name:'images', title:'รูปภาพ', type:'array', of:[{type:'image'}]}),
    defineField({name:'specPdf', title:'ไฟล์สเปก/แคตตาล็อก (PDF)', type:'file', options:{accept:'application/pdf'}}),
    defineField({name:'isFeatured', title:'แนะนำที่หน้าแรก', type:'boolean'}),
  ]
})
