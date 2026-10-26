export const text=(key,title,body,bullets,speech)=>({key,kind:'theory',title,body,bullets,script:body+'\n\n'+speech})
export const table=(key,title,body,columns,rows,speech)=>({key,kind:'comparison',title,body,columns,rows,script:body+'\n\n'+speech})
export const code=(key,title,source,explanation,speech)=>({key,kind:'example',title,visual:{type:'codeParts',parts:[{label:'Python 3',language:'python',code:source,explanation}],caption:''},script:speech})
