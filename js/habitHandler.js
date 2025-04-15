import { addHabits, getHabits, updateHabit } from "./habitService.js";

const habitsContainerElement = document.getElementById("habitsContainer");

const habitNameElement = document.getElementById("habitName");
const habitFrequencyElement = document.getElementById("habitFrequency");
const addHabitBtn = document.getElementById("addHabit");

addHabitBtn.addEventListener("click", ()=>{createHabit();});


export function createHabit(){
    const habitID = "habit-"+getHabits().length+1;
    let habitName = habitNameElement.value;
    let habitFreq = habitFrequencyElement.value;
    let habitStreak = {current: 0, lontest:0};
    let habitArchived = false;
    const habits = getHabits;
    const habit = {
        id : habitID,
        name : habitName, 
        createdAt : new Date(),
        frequency : habitFreq, 
        lastDone : "",
        log : [], 
        streak : {current : 0, longest : 0}, 
        archived : false
    }
    addHabits(habit);
    displayHabits();

}

export function logEmpty(habit){
    return habit.lastDone == "" ? "never" : habit[i].lastDone;
}

export function displayHabits(){
    const habits = getHabits();
    let habitsHTML = "";
    for(let i = 0; i<habits.length;i++){
        let lastDoneContent = logEmpty(habits[i]);
        habitsHTML+= `<div class = "habit" data-id="${habits[i].id}"><input type="checkbox"> ${habits[i].name} (last done : ${lastDoneContent})</div>`;
    }
    
    habitsContainerElement.innerHTML=habitsHTML;
}

habitsContainerElement.addEventListener('click', btn => {
    const habitID = btn.target.parentNode.dataset.id;
    if(btn.target.checked){btn.target.parentNode.classList.add("done"); updateHabit(habitID); }
    else{btn.target.parentNode.classList.remove("done"); }
});
displayHabits();