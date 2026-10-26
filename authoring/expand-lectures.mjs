import {semester4Explanations} from './explanations-semester4.mjs'
import {semester5Explanations} from './explanations-semester5.mjs'
export const explanationChapters=[...semester4Explanations,...semester5Explanations]
export function expandLectures(raw,lectureIndex,lectureId){
 return raw.flatMap(source=>{
  const question=['s004','s010','s016'].findIndex(suffix=>source.id===`${lectureId}-${suffix}`)
  if(question<0)return [source]
  return [source,...explanationChapters[lectureIndex][question].map(({key,...page})=>({
   ...page,id:`${lectureId}-q${question+1}-theory-${key}`,kicker:'Развёрнутое объяснение'
  }))]
 })
}
