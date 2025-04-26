import { getHabits } from "./habitService.js";




export function deleteHabit(id, index){
    let habits = getHabits();
    let habit = habits.filter(h => h.id == id);
    habit = habit[0];
    //const index = habit.id.split("-")[1];
    
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

    habit.frequency = frequency;

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