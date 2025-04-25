import { getHabits } from "./habitService.js";
import { deleteHabit } from "./settingsService.js";

const settingsHabitsElement = document.getElementById("settingsHabits");


export function displayHabitsToEdit(){
    const habits = getHabits();
    
    let elementHTML = "";
    for(let i = 0; i<habits.length; i++){
        
        elementHTML+=`<div class="habit" data-id="${habits[i].id}">
            <div class="habitTitle">
                <div class="habitName">${habits[i].name}</div>
                <div class="buttons"><button class="editHabit editBtn">edit.</button><button class="deleteHabit deleteBtn">x</button></div>
            </div>
            <div class="habitFrequency">every ${habits[i].frequency+" day(s)"}</div>
        </div>`;
        
    }
    settingsHabitsElement.innerHTML = elementHTML;
}

settingsHabitsElement.addEventListener('click', (btn) =>{
    const id = btn.target.parentElement.parentElement.parentElement.dataset.id;

    if(btn.target.classList.contains("deleteHabit")){
        deleteHabit(id);
        displayHabitsToEdit();
    }
    if(btn.target.classList.contains("editHabit")){
    }
})



displayHabitsToEdit();