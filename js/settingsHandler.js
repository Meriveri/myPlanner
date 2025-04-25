import { getHabits } from "./habitService.js";
import { deleteHabit, editHabitName, editHabitFrequency } from "./settingsService.js";

const settingsHabitsElement = document.getElementById("settingsHabits");

export function showHabitEditPanel(id){
    const editPanels = document.getElementsByClassName("habitEditPanel")
    if(!editPanels[id].classList.contains("visible")){editPanels[id].classList.add("visible");}
    else{editPanels[id].classList.remove("visible");}

}


export function displayHabitsToEdit(){
    const habits = getHabits();
    
    
    let elementHTML = "";
    for(let i = 0; i<habits.length; i++){
        let isActive = habits[i].archived ? "inactive" : "active";
        
        elementHTML+=`<div class="habit" data-id="${habits[i].id}">
            <div class="habitTitle">
                <div class="habitName">${habits[i].name}</div>
                <div class="buttons"><button class="editHabit editBtn">edit.</button><button class="deleteHabit deleteBtn">x</button></div>
            </div>
            <div class="habitFrequency">every ${habits[i].frequency} day(s) | ${isActive}</div>
            <div class="habitEditPanel">
                            <input class="nameInput" placeholder="new habit name"/>
                            <input class="frequencyInput" type="number" placeholder="every x days"/><button class="okBtn updateHabit">ok</button>
            </div>
        </div>`;
        
    }
    settingsHabitsElement.innerHTML = elementHTML;
}

settingsHabitsElement.addEventListener('click', (btn) =>{
    const id = btn.target.parentElement.parentElement.parentElement.dataset.id;

    if(btn.target.classList.contains("deleteHabit")){
        const clickedHabit = btn.target.closest(".habit");
        const allHabits = Array.from(settingsHabitsElement.querySelectorAll(".habit"));
        const indexOfHabit = allHabits.indexOf(clickedHabit);
    
        deleteHabit(id, indexOfHabit);
        displayHabitsToEdit();
    }
    if(btn.target.classList.contains("editHabit")){
        const clickedHabit = btn.target.closest(".habit");
        const allHabits = Array.from(settingsHabitsElement.querySelectorAll(".habit"));
        const indexOfHabit = allHabits.indexOf(clickedHabit);

        console.log(indexOfHabit);

        
        showHabitEditPanel(indexOfHabit);
    }

    if(btn.target.classList.contains("updateHabit")){

    const id = btn.target.parentElement.parentElement.dataset.id;
    const clickedHabit = btn.target.closest(".habit");
    const allHabits = Array.from(settingsHabitsElement.querySelectorAll(".habit"));
    const indexOfHabit = allHabits.indexOf(clickedHabit);

    const name = document.getElementsByClassName("nameInput")[indexOfHabit].value;
    const frequency = document.getElementsByClassName("frequencyInput")[indexOfHabit].value;


    editHabitName(id, name);
    editHabitFrequency(id, frequency);
    displayHabitsToEdit();
    }
})

displayHabitsToEdit();