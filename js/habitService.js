import { addXDaysToDate, dateToYMD, getDayDifference, nextDueDate } from "./utils.js";

export function getHabits() {
    return JSON.parse(localStorage.getItem("habits")) || [];
}

export function addHabit(habit) {
    const habits = getHabits();
    habits.push(habit);
    localStorage.setItem("habits", JSON.stringify(habits));
}


export function getHabitByID(id){
    const habits = getHabits();
    const habit = habits.filter(h =>  h.id == id);
    return habit;
}

export function updateHabit(id){
    const habits = getHabits();
    const habit = habits.find(h => h.id === id);
    habit.lastDone = dateToYMD(new Date());
    let streak = habit.streak.current;
    
    let logs = habit.log;
    logs.push(dateToYMD(new Date()));
    
    let prevLog = new Date(logs[logs.length-2]);
    let lastLog = new Date(logs[logs.length-1]);
    const daysDiff = getDayDifference(prevLog, lastLog);

    habit.nextDue = nextDueDate(habit.lastDone, habit.frequency.value);


    if (logs.length > 1){
        if(daysDiff <= parseInt(habit.frequency)){streak =streak+1;}
        else{streak=1;}
        
    }
    else{
        streak=1;
    }
    habit.streak.current = streak;

    if(habit.streak.current > habit.streak.longest){
        habit.streak.longest=habit.streak.current;
    }
    localStorage.setItem("habits", JSON.stringify(habits));
}

export function uncheckHabit(id){
    const habits = getHabits();
    const habit = habits.find(h => h.id === id);
    habit.log.pop();
    if(habit.log.length>=1){habit.lastDone = habit.log[habit.log.length-1];}
    else{habit.lastDone = "";}

    
    if(habit.lastDone != ""){habit.nextDue = nextDueDate(habit.lastDone, habit.frequency.value);}
    else{habit.nextDue = dateToYMD(new Date());}
    habit.streak.current-=1;

    localStorage.setItem("habits", JSON.stringify(habits)); 
}

export function lateCheckIn(id){
    const habits = getHabits();
    const habit = habits.filter(h => h.id == id)[0];
    const yesterday = addXDaysToDate(new Date(), -1);
    let log = habit.log;
    if(!log.includes(yesterday)){
        habit.log.push(yesterday);
        habit.lastDone = yesterday;
        habit.nextDue = new Date();
    }
    console.log(habit);

    localStorage.setItem("habits", JSON.stringify(habits)); 
}