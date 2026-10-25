import {useEffect} from 'react'
export function KeyboardMenus(){
 useEffect(()=>{
  const close=(event:KeyboardEvent)=>{
   if(event.key!=='Escape')return
   const details=document.querySelector<HTMLDetailsElement>('.pd-more[open]')
   if(details){details.open=false;details.querySelector<HTMLElement>('summary')?.focus()}
  }
  window.addEventListener('keydown',close)
  return()=>window.removeEventListener('keydown',close)
 },[])
 return null
}
