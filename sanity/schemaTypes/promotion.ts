import {defineType, defineField} from 'sanity'
export default defineType({
  name:'promotion', title:'Promotions', type:'document',
  fields:[
    defineField({name:'title', title:'ชื่อโปร', type:'string', validation:r=>r.required()}),
    defineField({name:'banner', title:'ภาพแบนเนอร์', type:'image'}),
    defineField({name:'start', title:'เริ่ม', type:'date'}),
    defineField({name:'end', title:'สิ้นสุด', type:'date'}),
    defineField({name:'featuredProducts', title:'สินค้าที่ร่วมรายการ', type:'array', of:[{type:'reference', to:[{type:'product'}]}]}),
    defineField({name:'active', title:'แสดงบนเว็บ', type:'boolean'}),
  ]
})
