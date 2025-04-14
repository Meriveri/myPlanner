export function dateToYMD(date){

    date = new Date(date).toLocaleDateString("fr-CA", {year:'numeric', month:'2-digit', day:'2-digit'})

    return date;
}

export function getArrayOfWeek(date){
    date = new Date(date);
    const firstDayOfWeek = date.getDate()+1-date.getDay();
    const lastDayOfWeek = date.getDate()+7-date.getDay();
    let arrayOfWeekDays = [];
    for(let i=firstDayOfWeek; i<=lastDayOfWeek;i++){
        arrayOfWeekDays.push(dateToYMD(new Date(`${date.getFullYear()}-${date.getMonth()+1}-${i}`)));
    }
   
   return arrayOfWeekDays; }