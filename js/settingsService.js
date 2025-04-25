import { getHabits } from "./habitService.js";




export function deleteHabit(id){
    let habits = getHabits();
    let habit = habits.filter(h => h.id == id);
    habit = habit[0];
    const index = habit.id.split("-")[1];
    
    habits.splice(index, 1);

    localStorage.setItem("habits", JSON.stringify(habits));
}

export function updateHabitByID(id){

}
