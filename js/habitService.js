import { dateToYMD } from "./utils.js";

export function getHabits() {
    return JSON.parse(localStorage.getItem("habits")) || [];
}

export function addHabits(habit) {
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
    const habit = getHabitByID(id);
    habit[0].lastDone = dateToYMD(new Date());
    let streak = habit[0].log.length+1;
    habit[0].streak.current = streak;
    if(streak >= habit[0].streak.longest){habit[0].streak.longest=streak;}
    habit[0].log.push(dateToYMD(new Date()));
    localStorage.setItem("habits", JSON.stringify(habit));
}