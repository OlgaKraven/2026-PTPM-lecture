import fs from 'node:fs'
import {createHash} from 'node:crypto'
import {semester4} from '../authoring/semester4.mjs'
import {semester5} from '../authoring/semester5.mjs'
const literature=JSON.parse(fs.readFileSync('authoring/literature.json','utf8'))
for(const dir of ['public/teaching','authoring/teacher','docs'])fs.mkdirSync(dir,{recursive:true})
const course={schemaVersion:1,contentVersion:'1.0.0',id:'ptpm',code:'МДК.01.02',discipline:'Поддержка и тестирование программных модулей',year:'',heroTitle:'Поддержка и тестирование',heroAccent:'программных модулей',slogan:'',mascot:'brand/ptpm-rhino.png',mascotAlt:'Носорог анализирует результаты тестирования программного модуля',logo:'brand/synergy-logo.png',ornament:'brand/side-ornament.png',topicArrow:'brand/topic-arrow.webp',font:'fonts/raleway-cyrillic.woff2',materialsUrl:'https://disk.yandex.ru/d/C5-55HsqSBpVCQ',literature,assessment:{mode:'autonomous',url:'assessment.json'},demo:false,semesters:[4,5],lectures:[]}
const pack={schemaVersion:1,courseId:course.id,contentVersion:course.contentVersion,notes:{}}
const assessment={schemaVersion:1,courseId:course.id,contentVersion:course.contentVersion,mode:'autonomous-educational',keys:{}}
const reviews={}
const rawNotes=new Map(),visualPlan=[],coverage=[]
const weights={title:30,agenda:90,literature:40,materials:30,section:45,theory:230,comparison:250,process:230,example:250,test:140,summary:140}
for(const seed of [...semester4,...semester5]){
 const lecture={id:seed.id,title:seed.title,sourceTitle:`Тема ${seed.topic}`,semester:seed.semester,question:seed.result,slides:[]}
 const raw=[
  {kind:'title',title:seed.title,kicker:`МДК.01.02 · ${seed.semester} семестр`,script:`Тема занятия — ${seed.title.toLocaleLowerCase('ru')}. ${seed.result} Примеры условные; правила модулей заданы в самом материале. В самостоятельных случаях сначала работаем с условием, затем сопоставляем ход решения с разбором.`},
  {kind:'agenda',title:'Вопросы лекции',kicker:'План занятия',script:`Лекция строится по трём вопросам. ${seed.questions.map((q,i)=>`${i+1}. ${q}.`).join(' ')} ${seed.result} На каждый вопрос отводится объяснение, разобранный пример и самостоятельная попытка. Время в панели — плановый ориентир, а не измеренный хронометраж.`},
  ...seed.slides,
  {kind:'summary',title:'Проверьте, что вы можете объяснить',kicker:'Итог лекции',bullets:seed.questions.map(q=>`${q}?`),body:seed.result,script:`Вернитесь к трём вопросам занятия. Попросите назвать исходное условие и наблюдение, на котором основан каждый вывод. ${seed.result} Если ответ сводится к названию термина, вернитесь к конкретному примеру: какой вход выбран, почему ожидание именно такое и какой дефект проверка способна обнаружить.`},
  {kind:'literature',readingGroup:'primary',title:'Основная литература',kicker:'Литература',script:'Учебники из ранее подготовленных курсов используются для связи требований, контроля качества, жизненного цикла и сопровождения ИТ-продукта. Они не подменяют руководство по unittest. Для точного синтаксиса и терминологии используйте первичные материалы на следующем экране.'},
  {kind:'literature',readingGroup:'additional',title:'Дополнительные материалы',kicker:'Литература',script:'ISTQB используется для проверки основных понятий и техник тест-дизайна. Документация Python — источник поведения assertEqual, assertRaises, subTest и команд запуска. Ссылки ведут к первоисточникам; изучение всей программы сертификации не является заданием этой лекции.'},
  {kind:'materials',title:'Материалы к занятиям',kicker:'Материалы',supplement:{label:'Учебные примеры',href:'https://github.com/OlgaKraven/2026-PTPM-lecture/tree/main/examples'},script:'Покажите ссылку и QR-код папки, указанной для курса. Учебные примеры Python открываются кнопкой «Учебные примеры». Состав внешней папки может меняться; этот экран не является подтверждением наличия определённых файлов.'}
 ]
 let question=0
 const totalWeight=raw.reduce((sum,s)=>sum+(s.kicker==='Самостоятельный разбор'?560:weights[s.kind]||180),0)
 const budget=5400
 let allotted=0
 raw.forEach((source,index)=>{
  const id=`${lecture.id}-s${String(index+1).padStart(3,'0')}`
  if(source.kind==='section')question++
  const {script,answer,key,...slide}=source
  slide.id=id
  slide.kicker=slide.kicker||(slide.kind==='section'?`Вопрос ${question}`:`Вопрос ${question}`)
  if(slide.task){slide.task={...slide.task,id:`${id}-task`};assessment.keys[slide.task.id]=key}
  if(source.kicker==='Самостоятельный разбор')reviews[id]=answer
  lecture.slides.push(slide)
  const weight=source.kicker==='Самостоятельный разбор'?560:weights[source.kind]||180
  const estimatedSeconds=index===raw.length-1?budget-allotted:Math.round(weight/totalWeight*budget)
  allotted+=estimatedSeconds
  const note={script:script||`${source.title}. ${source.body||''} Предложите сопоставить это правило с предыдущим примером и объяснить, какое новое условие оно учитывает.`,preparation:source.visual?.type==='codeParts'?'Открыть учебные файлы examples. Python 3; стандартная библиотека unittest. Для фрагмента метода использовать класс TestCase, указанный на слайде.':source.kicker==='Самостоятельный разбор'?'Оставить время на самостоятельную запись решения; полный ответ показать после попытки.':'',notebook:source.notebook||'',questions:source.kind==='test'?source.task.prompt:source.kicker==='Самостоятельный разбор'?source.body:'',answer:answer||'',estimatedSeconds}
  pack.notes[id]=note
  rawNotes.set(id,note)
  if(slide.visual||slide.rows)visualPlan.push({lectureId:lecture.id,slideId:id,title:slide.title,purpose:slide.visual?.type==='codeParts'?'Проследить конкретный вызов, проверку и ожидаемое поведение':slide.rows?'Сопоставить данные, правила и результаты по общим столбцам':'Проследить связь условия, действия и наблюдаемого результата',catalog:slide.rows?'TAB-01':slide.visual?.type==='codeParts'?'ALG-01 (статичный разбор)':'свободная схема',representation:slide.visual?.type||'table'})
 })
 course.lectures.push(lecture)
 coverage.push({lectureId:lecture.id,semester:seed.semester,topic:seed.topic,hours:2,title:seed.title,questions:seed.questions,slides:lecture.slides.length,plannedSeconds:allotted})
}
const courseText=JSON.stringify(course,null,2)+'\n'
fs.writeFileSync('public/course.json',courseText)
fs.writeFileSync('public/teaching/notes.json',JSON.stringify(pack,null,2)+'\n')
fs.writeFileSync('public/assessment.json',JSON.stringify(assessment,null,2)+'\n')
fs.writeFileSync('public/practice-answers.json',JSON.stringify(reviews,null,2)+'\n')
fs.writeFileSync('docs/coverage.json',JSON.stringify(coverage,null,2)+'\n')
fs.writeFileSync('docs/visual-plan.json',JSON.stringify(visualPlan,null,2)+'\n')
const alignment={schemaVersion:1,courseId:course.id,contentVersion:course.contentVersion,sourceKind:'local',sourceSha256:createHash('sha256').update(courseText).digest('hex'),lectureIds:course.lectures.map(l=>l.id),documents:{teacher:'course.teacher.md',presenter:'course.presenter.md'},slides:[]}
let teacher=`# ${course.discipline}\n\nТекст для подготовки преподавателя. Учебные примеры условные.\n\n`,presenter=`# ${course.discipline}\n\nСценарий показа. Ответы предназначены преподавателю и раскрываются после самостоятельной попытки.\n\n`
for(const lecture of course.lectures){
 const teacherStart=teacher.length,presenterStart=presenter.length
 teacher+=`## ${lecture.semester} семестр. ${lecture.title}\n\n`
 presenter+=`## ${lecture.semester} семестр. ${lecture.title}\n\n`
 for(const [i,slide]of lecture.slides.entries()){
  const note=rawNotes.get(slide.id)
  const anchor=slide.id
  teacher+=`<a id="${anchor}"></a>\n\n### ${i+1}. ${slide.title}\n\n`
  if(slide.body)teacher+=`${slide.body}\n\n`
  if(slide.task)teacher+=`${slide.task.prompt}\n\n${slide.task.options.map((option,i)=>`${i+1}. ${option.text}`).join('\n')}\n\n`
  if(slide.visual?.type==='codeParts')for(const part of slide.visual.parts)teacher+=`\`\`\`python\n${part.code}\n\`\`\`\n\n${part.explanation}\n\n`
  if(slide.rows)teacher+=`| ${slide.columns.join(' | ')} |\n| ${slide.columns.map(()=> '---').join(' | ')} |\n${slide.rows.map(row=>`| ${row.join(' | ')} |`).join('\n')}\n\n`
  if(slide.visual?.type==='process')teacher+=slide.visual.items.map((item,i)=>`${i+1}. **${item.title}.** ${item.text}`).join('\n')+'\n\n'
  teacher+=`${note.script}\n\n`
  if(note.notebook)teacher+=`**Запишите.** ${note.notebook}\n\n`
  if(note.answer)teacher+=`**Разбор после попытки.** ${note.answer}\n\n`
  presenter+=`<a id="${anchor}"></a>\n\n### ${i+1}. ${slide.title}\n\n${note.script}\n\n`
  if(note.preparation)presenter+=`**Подготовка.** ${note.preparation}\n\n`
  if(note.questions)presenter+=`**Вопрос или задание.** ${note.questions}\n\n`
  if(note.notebook)presenter+=`**Запишите.** ${note.notebook}\n\n`
  if(note.answer)presenter+=`**Ответ после попытки.** ${note.answer}\n\n`
  alignment.slides.push({lectureId:lecture.id,slideId:slide.id,displayNumber:i+1,title:slide.title,anchors:{teacher:anchor,presenter:anchor}})
 }
 fs.writeFileSync(`authoring/teacher/${lecture.id}.teacher.md`,`# ${course.discipline}\n\n`+teacher.slice(teacherStart))
 fs.writeFileSync(`authoring/teacher/${lecture.id}.presenter.md`,`# ${course.discipline}\n\n`+presenter.slice(presenterStart))
}
fs.writeFileSync('authoring/teacher/course.teacher.md',teacher)
fs.writeFileSync('authoring/teacher/course.presenter.md',presenter)
fs.writeFileSync('authoring/teacher/alignment.json',JSON.stringify(alignment,null,2)+'\n')
console.log(`${course.lectures.length} lectures, ${alignment.slides.length} slides, ${Object.keys(assessment.keys).length} questions`)
