import { addHabits, getHabits } from "./habitService.js";

const habitsContainerElement = document.getElementById("habitsContainer");

export function displayHabits(){
    const habit = {
        id : Date.now(),
        name : "shower", 
        lastCompleted : "2025-03-12",
        completedOn : ""
    }
    localStorage.removeItem("habits");
    addHabits(habit);
    let habitsHTML = "";
    const habits = getHabits();
    for(let i = 0; i<habits.length;i++){
        habitsHTML+= `<div class = "habit" data-id="${habits[i].id}"><input type="checkbox"> ${habits[i].name}</div>`;
    }
    
    habitsContainerElement.innerHTML=habitsHTML;
}

displayHabits();