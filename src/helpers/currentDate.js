export const formatDateInput = (date, iso=false, addOneday=false) =>{
  const year = date.getFullYear()
  const month = String(date.getMonth()+1).padStart(2,'0')
  const day = String(date.getDate() + (addOneday ? 1 : 0)).padStart(2,'0')
  
  if(iso) return `${year}-${month}-${day}T23:59:00.000Z`

  return `${year}-${month}-${day}`
}