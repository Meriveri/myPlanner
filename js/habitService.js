import { addXDaysToDate, dateToYMD, getDayDifference, nextDueDate, calculateStreak } from "./utils.js";

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
    
    
    habit.log.push(dateToYMD(new Date()));
    const logs = habit.log;

    habit.nextDue = nextDueDate(habit.lastDone, habit.frequency.value);

    habit.streak.current = calculateStreak(habit);

    if(habit.streak.current > habit.streak.longest){
        habit.streak.longest=habit.streak.current;
    }
    localStorage.setItem("habits", JSON.stringify(habits));
}

export function uncheckHabit(id){
    const habits = getHabits();
    const habit = habits.find(h => h.id === id);
    habit.log.pop();

    const logs = habit.log;
    if(logs.length>=1){habit.lastDone = logs[logs.length-1];}
    else{habit.lastDone = "";}
    
    if(habit.lastDone != ""){habit.nextDue = nextDueDate(habit.lastDone, habit.frequency.value);}
    else{habit.nextDue = dateToYMD(new Date());}

    habit.streak.current= calculateStreak(habit);
    if(habit.streak.current == habit.streak.longest){habit.streak.longest=dayDiffIsOneArray.length;}

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
        habit.nextDue = addXDaysToDate(yesterday, habit.frequency);
        habit.streak.current+=1;
        if(habit.streak.current >= habit.streak.longest){habit.streak.longest=habit.streak.current;}
    }

    localStorage.setItem("habits", JSON.stringify(habits)); 
}