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

export function getDayDifference(day1, day2){
    const timeDiff = day2-day1;
    return timeDiff/ (1000 * 60 * 60 * 24);

}

export function addXDaysToDate(date, days){
    const newDate = new Date(date);
    days = parseInt(days);
    
    newDate.setDate(date.getDate() + days);

    return (dateToYMD(newDate));
}

export function nextDueDate(date, days){
    if(date != ""){date = new Date(date);}
    else{date = new Date();}
    return addXDaysToDate(date, days);
}

export function pastXDays(date, x){
    let prevDays = [];
    date = dateToYMD(date);
    for(let i=1; i<=x; i++){
        prevDays.push(addXDaysToDate(new Date(date), -i))
    }
    return prevDays;
}

export function nextXDays(date, x){
    let prevDays = [];
    date = dateToYMD(date);
    for(let i=0; i<=x; i++){
        prevDays.push(addXDaysToDate(new Date(date), i))
    }
    return prevDays;
}

export function calculateStreak(habit){
    let streak = 1;
    let logs = habit.log;
    for (let i = logs.length - 1; i > 0; i--) {
        const diff = parseInt(getDayDifference(new Date(logs[i - 1]), new Date(logs[i])));
        if (diff <= habit.frequency.value) {streak++;} 
        else {break;}
    }   
    return streak;
}