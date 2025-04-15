import { addHabits, getHabits, updateHabit } from "./habitService.js";

const habitsContainerElement = document.getElementById("habitsContainer");

export function displayHabits(){
    const habit = {
        id : "habit-000",
        name : "shower", 
        createdAt : new Date(),
        frequency : 1, 
        lastDone : "2025-04-13",
        log : ["2024-04-12", "2025-04-13"], 
        streak : {
            current : 2, 
            longest : 2
        }, 
        archived : false
    }
    const habits = getHabits();
    let habitsHTML = "";
    for(let i = 0; i<habits.length;i++){
        habitsHTML+= `<div class = "habit" data-id="${habits[i].id}"><input type="checkbox"> ${habits[i].name} (last done : ${habits[i].lastDone})</div>`;
    }
    
    habitsContainerElement.innerHTML=habitsHTML;
}

habitsContainerElement.addEventListener('click', btn => {
    const habitID = btn.target.parentNode.dataset.id;
    if(btn.target.checked){btn.target.parentNode.classList.add("done"); updateHabit(habitID); }
    else{btn.target.parentNode.classList.remove("done"); }
});
displayHabits();