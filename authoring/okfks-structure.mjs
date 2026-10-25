import {details} from './question-details.mjs'
import {details5} from './question-details5.mjs'
const all=[...details,...details5]
const fourth=[
 ['Проверено отсутствие всех отказов ниже порога','Случайное значение входа','Каждый повтор автоматически охватывает новый класс'],
 ['Записана версия модуля','Результат последнего запуска','Фактический результат нужно придумать из требования'],
 ['По алфавиту названий параметров','Четыре','Нужно повторить тот же двойной неверный вход'],
 ['Исключение требуется на любой границе','Успех, если модуль напечатал предупреждение','Проблема возникает у всех пользователей'],
 ['Заменяет ошибочное значение ожидаемым','Слишком мало тестовых файлов','Чтобы тестам всегда требовалась сеть'],
 ['Сеть не влияет ни на один тест','Настройки интерфейса приложения','Достаточно сравнить названия тестов'],
 ['Проверку всех найденных файлов, включая пропущенные','Принять NameError за ValueError','Отсутствие ошибок на одном входе доказывает эквивалентность'],
 ['Изменить ожидание под любой полученный результат','Чтобы затем заменить требование результатом программы','Любой старый прогон на другом коде']
]
const textSlide=(id,kind,title,body,script,kicker,extra={})=>({id,kind,title,body,script,kicker,...extra})
export function structure(seed,li){
 const id=seed.id,slides=[],activities=[],questionMap=[]
 for(let qi=0;qi<3;qi++){
  const d=all[li][qi],q=qi+1,old=seed.slides.slice(qi*6,qi*6+6).map((s,i)=>({...s,id:`${id}-s${String(qi*6+i+3).padStart(3,'0')}`}))
  const [section,definition,logic,example,activity,single]=old
  section.kicker=`Вопрос ${q}`
  definition.kind='notebook';definition.kicker=`Определения · вопрос ${q}`
  logic.kicker=`Логика применения · ${q}`
  example.kicker=`Разбор по шагам · вопрос ${q}`
  const change=textSlide(`${id}-q${q}-changed`,'example',d.change[0],d.change[1],`${d.change[1]}\n\n${d.change[2]}`,`Разбор изменённого случая · вопрос ${q}`)
  const warning=textSlide(`${id}-q${q}-error`,'warning',d.error[0],d.error[1],`${d.error[1]}\n\n${d.error[2]}`,`Антиошибка · ${q}`)
  const summary=textSlide(`${id}-q${q}-conclusion`,'summary',d.conclusion[0],d.conclusion[1],`${d.conclusion[1]}\n\n${d.terms.map(([term,definition])=>`${term} — ${definition.toLocaleLowerCase('ru')}.`).join(' ')} В этих различиях важен объект проверки и наблюдаемое свидетельство. Попросите применить их к следующему самостоятельному случаю до раскрытия ответа.`,`Контроль понимания · ${q}`,{notebook:d.terms.map(([term,definition])=>`${term} — ${definition.toLocaleLowerCase('ru')}.`).join('\n')})
  const task=activity.body,href=`?mode=question-lab&lecture=${id}&question=${q}`
  const passport={...activity,title:`Практика: ${seed.questions[qi]}`,body:undefined,kicker:`Разбор задачи · вопрос ${q}`,activityPassport:{task,check:d.conclusion[1],href},script:`${task}\n\nОткройте «Разбор задачи». Сначала студент записывает прогноз и составляет решение по видимым данным. Ручные шаги выделяют свидетельства. После выбора и проверки обсудите основание, затем откройте полный разбор. Свободное обоснование оценивается по смыслу, а не по факту заполнения. Закройте окно и вернитесь к самопроверке этого вопроса.`,preparation:'Самостоятельный случай использует новые данные относительно разобранного лекционного примера. Подготовить собственную запись решения; ответ не раскрывать до попытки.'}
  const facts=task.split(/(?<=[.!?])\s+/u).filter(Boolean)
  const visual={type:'comparison',columns:['Наблюдение или условие','Данные'],rows:facts.map((text,i)=>[String(i+1),text]),caption:'Данные самостоятельного случая. По ним нужно составить решение; готовый ответ пока не показан.'}
  const choiceOrder=[1,2,0].map(x=>(x+qi+li)%3)
  const sourceOptions=d.choice.slice(1)
  activities.push({id:passport.id,revision:'okfks-structure-v2',lectureId:id,number:q,title:seed.questions[qi],task,check:d.conclusion[1],referenceSlideIds:[logic.id,example.id],exerciseSpec:{slideId:`${passport.id}-case`,catalogId:'TAB-01',kind:'source',title:'Данные самостоятельной задачи',overview:visual.caption,scope:'Сопоставление данных по заданному контракту.',visual,defaultScenario:'case',scenarios:[{id:'case',label:'Самостоятельный случай',condition:task,frames:[{caption:visual.caption,focus:[]},...facts.map((text,i)=>({caption:text,focus:[`row${i}`]}))]}]},decision:d.choice[0],options:choiceOrder.map(i=>sourceOptions[i]),correct:choiceOrder.indexOf(0),solution:activity.answer,hint:`Вернитесь к условию: ${facts[0]} Сопоставьте требуемый результат с фактическими данными. Не подменяйте наблюдение предположением.`})
  const correctId=single.key.correct[0]
  const newOptions=[...single.task.options,{id:'o4',text:fourth[li][qi]}]
  const offset=(li+qi)%4
  single.task={...single.task,id:`${single.id}-task`,options:[...newOptions.slice(offset),...newOptions.slice(0,offset)]}
  single.key={...single.key,optionExplanations:Object.fromEntries(newOptions.map(option=>[option.id,option.id===correctId?single.answer:`${single.answer} Вариант «${option.text}» не следует из указанных условий.`]))}
  single.title='Примените правило к ситуации';single.kicker=`Самопроверка · вопрос ${q} · 1 из 4`
  const multipleId=`${id}-q${q}-multiple`,multiOptions=d.multi[1].map((text,i)=>({id:`o${i+1}`,text})),multiCorrect=d.multi[2].map(i=>`o${i+1}`)
  const multiOrder=[2,0,4,1,3].map(x=>(x+li+qi)%5)
  const multiple={id:multipleId,kind:'test',title:'Выберите два ответа',kicker:`Самопроверка · вопрос ${q} · 2 из 4`,task:{id:`${multipleId}-task`,type:'multiple',prompt:d.multi[0],choose:2,options:multiOrder.map(i=>multiOptions[i])},key:{type:'multiple',correct:multiCorrect,explanation:`Условию соответствуют: ${d.multi[2].map(i=>d.multi[1][i]).join('; ')}. Нужен полный набор без лишних вариантов.`,optionExplanations:Object.fromEntries(multiOptions.map((option,i)=>[option.id,d.multi[2].includes(i)?`Верно: ${option.text}. Это следует из условия и разобранного контракта.`:`Неверно: ${option.text}. Сопоставьте с требуемыми признаками: ${d.multi[2].map(i=>d.multi[1][i]).join('; ')}.`]))},script:`${d.multi[0]} Выберите ровно два утверждения. Вопрос проверяет совместное выполнение требований; один верный пункт без второго или с лишним не является полным ответом.`}
  multiple.answer=multiple.key.explanation
  const shortId=`${id}-q${q}-short`,shortKey=typeof d.short[1]==='number'?{numeric:{value:d.short[1],tolerance:0}}:{accepted:[d.short[1]]}
  const short={id:shortId,kind:'test',title:typeof d.short[1]==='number'?'Выполните расчёт':'Назовите существенное понятие',kicker:`Самопроверка · вопрос ${q} · 3 из 4`,task:{id:`${shortId}-task`,type:'short',prompt:d.short[0]},key:{type:'short',...shortKey,explanation:`Ожидаемый ответ: ${d.short[1]}. Он получен из явно заданного условия; пробелы и регистр текстового ответа нормализуются, числовой допуск равен нулю.`},script:`${d.short[0]} До отправки проверьте объект результата и формат: число вводится без единицы, если это прямо указано. Ноль является самостоятельным числом и отличается от пустого поля.`};short.answer=short.key.explanation
  const matchingId=`${id}-q${q}-matching`,items=d.terms.map(([term],i)=>({id:`i${i+1}`,text:term})),options=d.terms.map(([,definition],i)=>({id:`o${i+1}`,text:definition}))
  const matching={id:matchingId,kind:'test',title:'Установите предметные соответствия',kicker:`Самопроверка · вопрос ${q} · 4 из 4`,task:{id:`${matchingId}-task`,type:'matching',prompt:'Сопоставьте понятие или элемент проверки с его смыслом в этом вопросе. Каждое соответствие используется один раз.',items,options:[options[2],options[0],options[3],options[1]]},key:{type:'matching',pairs:Object.fromEntries(items.map((item,i)=>[item.id,`o${i+1}`])),explanation:d.terms.map(([term,definition])=>`${term}: ${definition}.`).join(' ')},script:'Сопоставьте все четыре элемента. Сначала определите смысл каждого понятия, затем выберите соответствие. Важно различать проверяемый объект и свидетельство, а не угадывать пару по положению строки.'};matching.answer=matching.key.explanation
  const group=[section,definition,logic,example,change,warning,summary,passport,single,multiple,short,matching]
  slides.push(...group)
  questionMap.push({lectureId:id,questionId:`${id}-q${q}`,title:seed.questions[qi],outcome:d.conclusion[1],explanationIds:group.slice(0,7).map(s=>s.id),activityId:passport.id,taskIds:group.slice(8).map(s=>s.task.id)})
 }
 return {slides,activities,questionMap}
}
