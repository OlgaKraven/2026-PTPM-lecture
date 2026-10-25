import type {Slide} from '@olgakraven/lecture-engine'
type Code=Extract<NonNullable<Slide['visual']>,{type:'codeParts'}>
export function CodeVisual({visual}:{visual:Code}){
  return <figure className="ptpm-code"><div>{visual.parts.map((part,i)=><section key={i}><div className="ptpm-code-label">{part.label}</div><pre><code>{part.code}</code></pre><p>{part.explanation}</p></section>)}</div><figcaption>{visual.caption}</figcaption></figure>
}
