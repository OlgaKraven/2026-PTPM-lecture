import type {Slide} from '@olgakraven/lecture-engine'
type Process=Extract<NonNullable<Slide['visual']>,{type:'process'|'timeline'}>
export function ProcessVisual({visual}:{visual:Process}){
 return <figure className="ptpm-process"><ol>{visual.items.map((item,i)=><li key={i}><span className="ptpm-step-number">{String(i+1).padStart(2,'0')}</span><strong>{item.title}</strong><p>{item.text}</p></li>)}</ol><figcaption>{visual.caption}</figcaption></figure>
}
