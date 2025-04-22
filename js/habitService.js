import { dateToYMD } from "./utils.js";

export function getHabits() {
    return JSON.parse(localStorage.getItem("habits")) || [];
}

export function addHabit(habit) {
    const habits = getHabits();
    habits.push(habit);
    localStorage.setItem("habits", JSON.stringify(habits));
}

export function deleteAllHabits(){
    
}

export function getHabitByID(id){
    const habits = getHabits();
    const habit = habits.filter(h =>  h.id == id);
    return habit;
}

export function updateHabit(id){
    console.log(id);
    const habit = getHabitByID(id)[0];
    habit.lastDone = dateToYMD(new Date());
    let streak = habit.streak.current;
    let logs = habit.log;
    logs.push(dateToYMD(new Date()));
    
    let prevLog = new Date(logs[logs.length-2]);
    let lastLog = new Date(logs[logs.length-1]);
    const timeDiff = lastLog - prevLog; 
    const daysDiff = timeDiff/ (1000 * 60 * 60 * 24);

    if (logs.length >= 2){
        if(daysDiff == 1){streak +=1;}
        else{streak=1;}
        
    }
    else{
        streak=1;
    }

    if(streak >= habit.streak.longest){
        habit.streak.longest=streak;
    }
    localStorage.setItem("habits", JSON.stringify(habit));
}