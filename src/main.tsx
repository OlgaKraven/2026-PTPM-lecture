import {createRoot} from 'react-dom/client'
import {LectureSite,validateCourse,VisualRendererProvider} from '@olgakraven/lecture-engine'
import '@olgakraven/lecture-engine/style.css'
import {CourseCatalog} from './CourseCatalog'
import {prepareTeacherSession} from './teacherNotes'
import {CodeVisual} from './CodeVisual'
import {PracticeReview} from './PracticeReview'
import {ProcessVisual} from './ProcessVisual'
import {KeyboardMenus} from './KeyboardMenus'
import './presentation-design.css'
import './typography.css'
import './ptpm.css'

async function start(){
  const base=import.meta.env.BASE_URL
  const response=await fetch(`${base}course.json`)
  if(!response.ok)throw new Error('Не удалось открыть лекции')
  const course:unknown=await response.json()
  validateCourse(course)
  const mode=new URL(location.href).searchParams.get('mode')
  const reviewsResponse=await fetch(`${base}practice-answers.json`)
  if(!reviewsResponse.ok)throw new Error('Не удалось открыть разборы заданий')
  const reviews:Record<string,string>=await reviewsResponse.json()
  let session:Awaited<ReturnType<typeof prepareTeacherSession>>|undefined
  if(mode!=='audience'&&mode!=='print'){
    const notes=await fetch(`${base}teaching/notes.json`)
    if(!notes.ok)throw new Error('Не удалось загрузить сценарий преподавателя')
    session=await prepareTeacherSession(course,base,await notes.json(),{getItem:key=>localStorage.getItem(key)})
  }
  createRoot(document.getElementById('root')!).render(
    <VisualRendererProvider render={({slide})=>reviews[slide.id]?<PracticeReview key={slide.id} slideId={slide.id} title={slide.title} answer={reviews[slide.id]} version={course.contentVersion}/>:slide.visual?.type==='codeParts'?<CodeVisual visual={slide.visual}/>:slide.visual?.type==='process'?<ProcessVisual visual={slide.visual}/>:undefined}>
      <KeyboardMenus/>
      <LectureSite course={course} base={base} teacherNotes={session?.notes} resolveTeacherNotes={session?.resolve} renderCatalog={props=><CourseCatalog {...props}/>}/>
    </VisualRendererProvider>)
}
start().catch(error=>{document.getElementById('root')!.textContent=String(error)})
