export function refineSource(source){
 if(source.kind==='literature'&&source.readingGroup==='primary')source.script='Учебник по управлению ИТ-проектами связывает требования, контроль качества и изменения на протяжении жизненного цикла. Учебник по проектированию информационных систем помогает определить границы модуля и его интерфейса. Точные правила наших учебных функций заданы в примерах; синтаксис unittest и значения терминов уточняем по первичным материалам следующего экрана.'
 if(source.id==='s05-01-unit-tests-s006')source.script=source.script.replace('Команда является предметной частью лекции: она выполняет изучаемые тесты. ','')
 if(source.id==='s05-04-maintenance-s016')source.script=source.script.replace(' Не включаем в учебные карточки служебную историю разработки курса.','')
 if(source.id.endsWith('-s024')){
  source.supplement={label:'Учебные примеры Python',href:'downloads/ptpm-examples.zip'}
  source.script='По QR-коду открывается общая папка дисциплины. Учебные файлы Python доступны отдельной кнопкой «Учебные примеры Python»: скачайте архив, распакуйте его и откройте терминал в папке examples. Там находятся delivery.py, inventory.py, order.py и их тесты. Выполните python -m unittest discover -v. Фрагменты методов на слайдах вставляются внутрь класса unittest.TestCase; готовые классы и импорты есть в архиве. Содержимое общей папки проверяется отдельно и может меняться.'
 }
 if(source.visual?.type==='codeParts'){
  for(const part of source.visual.parts){
   part.language='python'
   if(source.id==='s05-03-suite-quality-s005'){part.label='Команды терминала';part.language='shell'}
   if(source.id==='s05-03-suite-quality-s011'){part.label='Пример вывода unittest';part.language='text'}
   part.code=part.code.replaceAll('self.assertTrue(accepted)','self.assertIs(accepted, True)').replaceAll('self.assertFalse(accepted)','self.assertIs(accepted, False)')
  }
  if(source.id==='s05-01-unit-tests-s017'||source.id==='s05-01-unit-tests-s018'){
   source.script+=' assertIs(accepted, True) или assertIs(accepted, False) проверяет именно предусмотренный логический объект. assertTrue проверил бы только истинность: например, число 1 тоже истинно, но не является объектом True. Выбор утверждения должен сохранять точность контракта.'
   source.visual.parts[0].explanation+=' assertIs проверяет именно True/False, а не истинность другого значения.'
  }
 }
 if(source.id==='s05-02-dependencies-s006'){
  delete source.visual
  source.kind='comparison'
  source.columns=['Граница проверки','Источник данных','Что наблюдаем','Что остаётся за границей']
  source.rows=[['Расчёт order_total','Заглушка: EUR → 100 рублей/евро','20 × 100 = 2000 рублей','Настоящее соединение и формат ответа'],['Адаптер внешнего источника','Настоящий ответ поставщика','Запрос EUR, разбор ответа, отказ соединения','Полнота тарифной логики других модулей']]
  source.body='Два вида проверки относятся к разным границам; стрелка обязательного порядка между ними не нужна.'
  source.script='В первой строке объектом проверки является настоящий расчёт: сумма 20 евро и управляемый курс 100 дают ожидание 2000 рублей. Источник подменён, поэтому ни доступность сети, ни внешний формат здесь не исследованы. Во второй строке проверяется настоящий адаптер: важно, что он запросил, как разобрал ответ и как сообщил об отказе. Таблица сравнивает границы свидетельств, а не предписывает выполнять один вид теста после другого. Дальше передадим источник параметром и сохраним сам расчёт настоящим.'
 }
}
