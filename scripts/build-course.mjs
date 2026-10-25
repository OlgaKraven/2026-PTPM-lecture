import fs from 'node:fs'
import {createHash} from 'node:crypto'
import {semester4} from '../authoring/semester4.mjs'
import {semester5} from '../authoring/semester5.mjs'
import {structure} from '../authoring/okfks-structure.mjs'
import {introductions} from '../authoring/introductions.mjs'
import {authoredDiagrams} from '../authoring/diagrams.mjs'
import {refineSource} from '../authoring/content-refinements.mjs'
const literature=JSON.parse(fs.readFileSync('authoring/literature.json','utf8'))
for(const dir of ['public/teaching','private/teacher','docs'])fs.mkdirSync(dir,{recursive:true})
fs.mkdirSync('src/infographics/data',{recursive:true})
fs.writeFileSync('src/infographics/data/ptpm.json',JSON.stringify(authoredDiagrams.map(({teaching,...spec})=>spec),null,2)+'\n')
const course={schemaVersion:1,contentVersion:'2.1.1',id:'ptpm',code:'МДК.01.02',discipline:'Поддержка и тестирование программных модулей',year:'',heroTitle:'Поддержка и тестирование',heroAccent:'программных модулей',slogan:'',mascot:'brand/ptpm-rhino.png',mascotAlt:'Носорог анализирует результаты тестирования программного модуля',logo:'brand/synergy-logo.png',ornament:'brand/side-ornament.png',topicArrow:'brand/topic-arrow.webp',font:'fonts/raleway-cyrillic.woff2',materialsUrl:'https://disk.yandex.ru/d/C5-55HsqSBpVCQ',literature,assessment:{mode:'autonomous',url:'assessment.json'},demo:false,semesters:[4,5],lectures:[]}
const pack={schemaVersion:1,courseId:course.id,contentVersion:course.contentVersion,notes:{}}
const assessment={schemaVersion:1,courseId:course.id,contentVersion:course.contentVersion,mode:'autonomous-educational',keys:{}}
const activities=[],questionMap=[]
const rawNotes=new Map(),visualPlan=[],coverage=[]
const weights={title:30,agenda:90,literature:40,materials:30,section:45,theory:230,comparison:250,process:230,example:250,test:140,summary:140}
for(const seed of [...semester4,...semester5]){
 const lectureIndex=course.lectures.length,prepared=structure(seed,lectureIndex)
 activities.push(...prepared.activities);questionMap.push(...prepared.questionMap)
 const lecture={id:seed.id,title:seed.title,sourceTitle:`Тема ${seed.topic}`,semester:seed.semester,question:seed.result,slides:[]}
 const raw=[
  {id:`${seed.id}-s001`,kind:'title',title:seed.title,kicker:`МДК.01.02 · ${seed.semester} семестр`,script:`Тема занятия — ${seed.title.toLocaleLowerCase('ru')}. ${seed.result} Примеры условные; правила модулей заданы в самом материале. В самостоятельных случаях сначала работаем с условием, затем сопоставляем ход решения с разбором.`},
  {id:`${seed.id}-s022`,kind:'literature',readingGroup:'primary',title:'Основная литература',kicker:'Литература',script:'Учебники из ранее подготовленных курсов используются для связи требований, контроля качества, жизненного цикла и сопровождения ИТ-продукта. Они не подменяют руководство по unittest. Для точного синтаксиса и терминологии используйте первичные материалы на следующем экране.'},
  {id:`${seed.id}-s023`,kind:'literature',readingGroup:'additional',title:'Дополнительная литература',kicker:'Литература',script:'ISTQB используется для проверки основных понятий и техник тест-дизайна. Документация Python — источник поведения assertEqual, assertRaises, subTest и команд запуска. Ссылки ведут к первоисточникам; изучение всей программы сертификации не является заданием этой лекции.'},
  {id:`${seed.id}-s024`,kind:'materials',title:'Материалы к занятиям',kicker:'Материалы',script:'Покажите ссылку и QR-код папки, указанной для курса. Учебные примеры Python также доступны в комплекте материалов. Состав внешней папки может меняться; этот экран не является подтверждением наличия определённых файлов.'},
  {id:`${seed.id}-s002`,kind:'agenda',title:'Вопросы темы',kicker:'Карта темы',script:`Лекция строится по трём вопросам. ${seed.questions.map((q,i)=>`${i+1}. ${q}.`).join(' ')} ${seed.result} Каждый вопрос проходит через объяснение, пример, изменение условия и самостоятельный разбор. Затем четыре задания разных типов проверяют то, что уже объяснено.`},
  ...introductions[lectureIndex].map(([title,body,extra],i)=>({id:`${seed.id}-intro-${i+1}`,kind:i===2?'example':'theory',title,body,kicker:['Контекст темы','Исходные знания','Сквозной случай'][i],script:`${body}\n\n${extra}`})),
  ...prepared.slides,
  {id:`${seed.id}-s021`,kind:'questions',title:'Вопросы от аудитории',kicker:'Итог темы',bullets:seed.questions.map(q=>`${q}?`),body:seed.result,script:`Вернитесь к трём вопросам занятия. ${seed.result} Попросите назвать исходное условие и наблюдение, на котором основан каждый вывод. Если ответ сводится к названию термина, вернитесь к конкретному примеру: какой вход выбран, почему ожидание именно такое и какое нарушение проверка способна обнаружить.`}
 ]
 let question=0
 const totalWeight=raw.reduce((sum,s)=>sum+(s.activityPassport?420:weights[s.kind]||180),0)
 const budget=5400
 let allotted=0
 raw.forEach((source,index)=>{
  refineSource(source)
  const id=source.id||`${lecture.id}-n${String(index+1).padStart(3,'0')}`
  if(source.kind==='section')question++
  const {script,answer,key,preparation,...slide}=source
  slide.id=id
  slide.kicker=slide.kicker||(slide.kind==='section'?`Вопрос ${question}`:`Вопрос ${question}`)
  if(slide.task){slide.task={...slide.task,id:`${id}-task`};assessment.keys[slide.task.id]=key}
  lecture.slides.push(slide)
  const weight=source.activityPassport?420:weights[source.kind]||180
  const estimatedSeconds=index===raw.length-1?budget-allotted:Math.round(weight/totalWeight*budget)
  allotted+=estimatedSeconds
  if(!script)throw Error(`Нет предметного сценария: ${id}`)
  const finalAnswer=source.kind==='questions'?prepared.slides.filter(s=>s.kind==='summary').map((s,i)=>`${seed.questions[i]}. ${s.body}`).join('\n\n'):answer||''
  const note={script,preparation:preparation||(source.visual?.type==='codeParts'?'Скачать архив с экрана материалов и распаковать папку examples. Python 3; unittest входит в стандартную библиотеку. Полные классы с импортами находятся в test_delivery.py, test_inventory.py и test_order.py. Короткий метод вставляется внутрь соответствующего класса; команды вводятся в терминале из examples, пример вывода не выполняется.':''),notebook:source.notebook||'',questions:source.kind==='test'?source.task.prompt:source.activityPassport?.task||'',answer:finalAnswer,estimatedSeconds}
  pack.notes[id]=note
  const diagram=authoredDiagrams.find(item=>item.slideId===id)
  if(diagram)note.script+=`\n\n${diagram.teaching}`
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
fs.writeFileSync('public/question-supplements.json',JSON.stringify({schemaVersion:1,courseId:course.id,contentVersion:course.contentVersion,activities},null,2)+'\n')
fs.writeFileSync('authoring/question-map.json',JSON.stringify(questionMap,null,2)+'\n')
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
  if(slide.kind==='literature')teacher+=course.literature[slide.readingGroup].map(item=>`${item.citation}\n\n${item.url}`).join('\n\n')+'\n\n'
  if(slide.kind==='materials')teacher+=`Материалы: ${course.materialsUrl}\n\nУчебные примеры Python: downloads/ptpm-examples.zip (кнопка на экране материалов).\n\n`
  if(slide.body)teacher+=`${slide.body}\n\n`
  if(slide.task)teacher+=`${slide.task.prompt}\n\n${(slide.task.items||[]).map((item,i)=>`${i+1}. ${item.text}`).join('\n')}\n\n${(slide.task.options||[]).map((option,i)=>`${i+1}. ${option.text}`).join('\n')}\n\n`
  const printedDiagram=authoredDiagrams.find(d=>d.slideId===slide.id)
  if(slide.visual?.type==='codeParts')for(const part of slide.visual.parts)teacher+=`\`\`\`${part.language||'python'}\n${part.code}\n\`\`\`\n\n${part.explanation}\n\n`
  if(slide.rows)teacher+=`| ${slide.columns.join(' | ')} |\n| ${slide.columns.map(()=> '---').join(' | ')} |\n${slide.rows.map(row=>`| ${row.join(' | ')} |`).join('\n')}\n\n`
  if(slide.visual?.type==='process'&&!printedDiagram)teacher+=slide.visual.items.map((item,i)=>`${i+1}. **${item.title}.** ${item.text}`).join('\n')+'\n\n'
  if(printedDiagram){
   const nodeTitles=new Map(printedDiagram.nodes.map(n=>[n.id,n.title]))
   teacher+=`**Разбор схемы.** ${printedDiagram.overview}\n\n${printedDiagram.edges.map(e=>`- ${nodeTitles.get(e.from)} → ${nodeTitles.get(e.to)}${e.label?` (ветвь «${e.label}»)` :''}`).join('\n')}\n\n| Сценарий | Условие | Результат |\n| --- | --- | --- |\n${printedDiagram.scenarios.map(s=>`| ${s.label} | ${s.condition} | ${s.frames.at(-1).result} |`).join('\n')}\n\n${printedDiagram.scope}\n\n`
  }
  const workedActivity=activities.find(a=>a.id===slide.id)
  if(workedActivity){const visual=workedActivity.exerciseSpec.visual;teacher+=`**Данные самостоятельного случая.**\n\n| ${visual.columns.join(' | ')} |\n| ${visual.columns.map(()=> '---').join(' | ')} |\n${visual.rows.map(row=>`| ${row.join(' | ')} |`).join('\n')}\n\n`}
  const teacherSpeech=slide.body&&note.script.startsWith(slide.body)?note.script.slice(slide.body.length).trimStart():note.script
  if(teacherSpeech)teacher+=`${teacherSpeech}\n\n`
  if(note.notebook)teacher+=`**Запишите.** ${note.notebook}\n\n`
  if(note.answer)teacher+=`**Разбор после попытки.** ${note.answer.split('\n\nВоспроизводимый вариант Python:')[0]}\n\n`
  if(workedActivity?.solutionCode)teacher+=`\`\`\`python\n${workedActivity.solutionCode}\n\`\`\`\n\nСохраните этот самостоятельный пример как test_case.py рядом с учебными модулями в examples; команда: python -m unittest test_case -v.\n\n`
  presenter+=`<a id="${anchor}"></a>\n\n### ${i+1}. ${slide.title}\n\n${note.script}\n\n`
  if(note.preparation)presenter+=`**Подготовка.** ${note.preparation}\n\n`
  if(note.questions)presenter+=`**Вопрос или задание.** ${note.questions}\n\n`
  if(note.notebook)presenter+=`**Запишите.** ${note.notebook}\n\n`
  if(note.answer)presenter+=`**Ответ после попытки.** ${note.answer}\n\n`
  alignment.slides.push({lectureId:lecture.id,slideId:slide.id,displayNumber:i+1,title:slide.title,anchors:{teacher:anchor,presenter:anchor}})
 }
 fs.writeFileSync(`private/teacher/${lecture.id}.teacher.md`,`# ${course.discipline}\n\n`+teacher.slice(teacherStart).trimEnd()+'\n')
 fs.writeFileSync(`private/teacher/${lecture.id}.presenter.md`,`# ${course.discipline}\n\n`+presenter.slice(presenterStart).trimEnd()+'\n')
}
fs.writeFileSync('private/teacher/course.teacher.md',teacher.trimEnd()+'\n')
fs.writeFileSync('private/teacher/course.presenter.md',presenter.trimEnd()+'\n')
fs.writeFileSync('private/teacher/alignment.json',JSON.stringify(alignment,null,2)+'\n')
console.log(`${course.lectures.length} lectures, ${alignment.slides.length} slides, ${Object.keys(assessment.keys).length} questions`)
