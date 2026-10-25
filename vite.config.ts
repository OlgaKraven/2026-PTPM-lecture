import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  base:'/2026-PTPM-lecture/',
  plugins:[{
    name:'omit-template-caption',
    enforce:'pre',
    transform(source,id){
      const path=id.replaceAll('\\','/')
      if(path.includes('/lecture-engine/lib/'))return source
        .replace('children: ["Версия шаблона ", r]','children: []')
        .replace('O("brand/rhino-okfks.png", a)','O(e.mascot, a)')
        .replace('t.slides.filter((e) => !e.task && e.kind !== "test")','t.slides')
    }
  },react()],
  optimizeDeps:{exclude:['@olgakraven/lecture-engine']}
})
