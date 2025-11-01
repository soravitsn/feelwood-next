import {defineType, defineField} from 'sanity'
export default defineType({
  name:'post', title:'Blog', type:'document',
  fields:[
    defineField({name:'title', title:'หัวข้อ', type:'string', validation:r=>r.required()}),
    defineField({name:'slug', title:'Slug', type:'slug', options:{source:'title'}}),
    defineField({name:'cover', title:'ภาพปก', type:'image'}),
    defineField({name:'excerpt', title:'สรุปสั้น', type:'text'}),
    defineField({name:'content', title:'เนื้อหา (Portable Text)', type:'array', of:[{type:'block'}]}),
    defineField({name:'publishedAt', title:'วันที่เผยแพร่', type:'datetime'})
  ]
})
