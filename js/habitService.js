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

    habit.nextDue = nextDueDate(habit.lastDone, habit.frequency.period);

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
    
    if(habit.lastDone != ""){habit.nextDue = nextDueDate(habit.lastDone, habit.frequency.period);}
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
        habit.nextDue = addXDaysToDate(new Date(yesterday), parseInt(habit.frequency.period));
        habit.streak.current+=1;
        if(habit.streak.current >= habit.streak.longest){habit.streak.longest=habit.streak.current;}
    }

    localStorage.setItem("habits", JSON.stringify(habits)); 
}

export function getHabitsLog(){
    return JSON.parse(localStorage.getItem("habitsLog")) || [];
}

export function addToHabitsLog(id, time) {
    const logs = getHabitsLog();
    const doneOn = dateToYMD(new Date());

    // Filter logs matching this id and date
    const sameDayLogs = logs.filter(entry => entry.id === id && entry.doneOn === doneOn);
    const otherLogs = logs.filter(entry => !(entry.id === id && entry.doneOn === doneOn));

    // Get highest 'times' already recorded for today
    const maxLoggedTime = sameDayLogs.reduce((max, entry) => Math.max(max, entry.times), 0);

    // Case 1: time is less than or equal to current max → replace all
    if (time <= maxLoggedTime) {
        for (let t = 1; t <= time; t++) {
            const newLog = { id, doneOn, times: t };
            otherLogs.push(newLog);
    }
    }

    // Case 2: time > max → append all missing times
    else {
        for (let t = 1; t <= time; t++) {
            otherLogs.push({ id, doneOn, times: t });
        }
    }

    localStorage.setItem("habitsLog", JSON.stringify(otherLogs));
}