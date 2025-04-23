import { displayHabits, isHabitCompletedToday } from "./habitHandler.js";
import { addXDaysToDate, dateToYMD, getDayDifference } from "./utils.js";

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

    if (logs.length >= 2){
        if(daysDiff == 1){streak +=1;}
        else{streak=1;}
        
    }
    else{
        streak=1;
    }
    habit.streak.current = streak;

    if(streak >= habit.streak.longest){
        habit.streak.longest=streak;
    }
    localStorage.setItem("habits", JSON.stringify(habits));
}

export function uncheckHabit(id){
    const habits = getHabits();
    const habit = habits.find(h => h.id === id);
    habit.log.pop();
    if(habit.log.length>=1){habit.lastDone = habit.log[habit.log.length];}
    else{habit.lastDone = "";}
    
    localStorage.setItem("habits", JSON.stringify(habits));   
}