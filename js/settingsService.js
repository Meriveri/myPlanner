import { getDLEvents } from "./deadlineEventService.js";
import { getHabits } from "./habitService.js";




export function deleteHabit(id, index){
    let habits = getHabits();
    let habit = habits.filter(h => h.id == id)[0];
    
    habits.splice(index, 1);

    localStorage.setItem("habits", JSON.stringify(habits));
}

export function editHabitName(id, name, index){
    let habits = getHabits();
    let habit = habits.filter(h => h.id == id);
    habit = habit[0];

    habit.name = name;

    localStorage.setItem("habits", JSON.stringify(habits));
}


export function editHabitFrequency(id, frequency){
    let habits = getHabits();
    let habit = habits.filter(h => h.id == id);
    habit = habit[0];

    habit.frequency.value = frequency.value;

    localStorage.setItem("habits", JSON.stringify(habits));

}

export function archiveHabit(id){
    let habits = getHabits();
    let habit = habits.filter(h=> h.id == id);
    habit = habit[0];
    console.log(habit.archived);
    if(habit.archived){habit.archived = false; }
    else{habit.archived = true;}

    localStorage.setItem("habits", JSON.stringify(habits));
}



export function deleteDLEvent(id, index){
    let DLEvents = getDLEvents();
    let DLEvent = DLEvents.filter(e => e.id == id)[0];
    
    DLEvents.splice(index, 1);

    localStorage.setItem("DLEvents", JSON.stringify(DLEvents));

}