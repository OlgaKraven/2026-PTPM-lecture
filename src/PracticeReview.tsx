import {useEffect,useRef,useState} from 'react'
import {createPortal} from 'react-dom'

export function PracticeReview({slideId,title,answer,version}:{slideId:string;title:string;answer:string;version:string}){
  const params=new URL(location.href).searchParams
  const audience=params.get('mode')==='audience',printing=params.get('mode')==='print'
  const session=params.get('session')||'study'
  const key=`ptpm:review:${version}:${session}:${slideId}`
  const read=()=>{try{return localStorage.getItem(key)==='open'}catch{return false}}
  const [open,setOpen]=useState(read)
  const dialog=useRef<HTMLDialogElement>(null),button=useRef<HTMLButtonElement>(null)
  function publish(value:boolean){
    setOpen(value)
    try{localStorage.setItem(key,value?'open':'closed')}catch{/* Current-window review remains available. */}
  }
  useEffect(()=>{
    const receive=(event:StorageEvent)=>{if(event.key===key)setOpen(event.newValue==='open')}
    window.addEventListener('storage',receive)
    return()=>window.removeEventListener('storage',receive)
  },[key])
  useEffect(()=>{
    if(open&&!printing&&!dialog.current?.open)dialog.current?.showModal()
    if(!open&&dialog.current?.open)dialog.current.close()
  },[open,printing])
  if(printing)return null
  return <>
    {!audience&&<button ref={button} type="button" className="ptpm-review-button" onClick={()=>publish(true)}>Разбор после попытки</button>}
    {createPortal(<dialog className="ptpm-review" ref={dialog} aria-labelledby={`review-${slideId}`} onCancel={event=>{event.preventDefault();if(!audience)publish(false)}} onClose={()=>{if(!audience){publish(false);button.current?.focus()}}}>
      <div className="ptpm-review-heading"><h2 id={`review-${slideId}`}>{title}</h2>{!audience&&<button type="button" onClick={()=>publish(false)} aria-label="Закрыть разбор">Закрыть</button>}</div>
      <p className="ptpm-review-label">Разбор решения</p><p className="ptpm-review-answer">{answer}</p>
    </dialog>,document.body)}
  </>
}
