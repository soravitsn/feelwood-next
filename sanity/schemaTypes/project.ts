import {defineType, defineField} from 'sanity'
export default defineType({
  name:'project', title:'Projects / Portfolio', type:'document',
  fields:[
    defineField({name:'name', title:'ชื่องาน', type:'string', validation:r=>r.required()}),
    defineField({name:'location', title:'ทำเล/พื้นที่', type:'string'}),
    defineField({name:'gallery', title:'รูปงาน', type:'array', of:[{type:'image'}]}),
    defineField({name:'usedProducts', title:'สินค้าที่ใช้', type:'array', of:[{type:'reference', to:[{type:'product'}]}]}),
    defineField({name:'note', title:'รายละเอียด/วิธีแก้ปัญหา', type:'text'}),
  ]
})
