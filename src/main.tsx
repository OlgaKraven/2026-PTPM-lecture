import {createRoot} from 'react-dom/client'
import {LectureSite,validateCourse,VisualRendererProvider} from '@olgakraven/lecture-engine'
import '@olgakraven/lecture-engine/style.css'
import {CourseCatalog} from './CourseCatalog'
import {prepareTeacherSession} from './teacherNotes'
import {CodeVisual} from './CodeVisual'
import {KeyboardMenus} from './KeyboardMenus'
import {renderLearningVisual,renderLearningVisualPrintSlide} from './infographics/LearningVisual'
import {PresentationSelects} from './presentation/PresentationSelects'
import './presentation-design.css'
import './typography.css'
import './ptpm.css'

async function start(){
  const base=import.meta.env.BASE_URL
  const response=await fetch(`${base}course.json`,{cache:'no-cache'})
  if(!response.ok)throw new Error('Не удалось открыть лекции')
  const course:unknown=await response.json()
  validateCourse(course)
  const mode=new URL(location.href).searchParams.get('mode')
  if(mode==='question-lab'){
    const {QuestionWorkshop}=await import('./lab/QuestionWorkshop')
    createRoot(document.getElementById('root')!).render(<QuestionWorkshop course={course} base={base}/>)
    return
  }
  let session:Awaited<ReturnType<typeof prepareTeacherSession>>|undefined
  if(mode!=='audience'&&mode!=='print'){
    const notes=await fetch(`${base}teaching/notes.json`,{cache:'no-cache'})
    if(!notes.ok)throw new Error('Не удалось загрузить сценарий преподавателя')
    session=await prepareTeacherSession(course,base,await notes.json(),{getItem:key=>localStorage.getItem(key)})
  }
  createRoot(document.getElementById('root')!).render(
    <VisualRendererProvider render={props=>props.slide.visual?.type==='codeParts'?<CodeVisual visual={props.slide.visual}/>:renderLearningVisual({...props,course})}>
      <KeyboardMenus/>
      <PresentationSelects courseId={course.id}/>
      <LectureSite course={course} base={base} teacherNotes={session?.notes} resolveTeacherNotes={session?.resolve} renderCatalog={props=><CourseCatalog {...props}/>} renderPrintSlide={props=>renderLearningVisualPrintSlide({...props,course})}/>
    </VisualRendererProvider>)
}
start().catch(error=>{document.getElementById('root')!.textContent=String(error)})
