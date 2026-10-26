const dates={before:'2027-02-02',deadline:'2027-02-03',after:'2027-02-04'}
const display=value=>value.split('-').reverse().join('.')
export const reminderCase={...dates,...Object.fromEntries(Object.entries(dates).map(([key,value])=>[`${key}Label`,display(value)]))}
