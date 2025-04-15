import { addHabits, getHabitByID, getHabits, updateHabit } from "./habitService.js";
import { dateToYMD } from "./utils.js";

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
    return habit.lastDone == "" ? "never" : habit.lastDone;
}

export function displayHabits(){
    const habits = getHabits();
    let habitsHTML = "";
    for(let i = 0; i<habits.length;i++){
        let lastDoneContent = logEmpty(habits[i]);
        let isChecked = isHabitCompletedToday(habits[i].id) ? "checked" : "";
        habitsHTML+= `<div class = "habit" data-id="${habits[i].id}"><input type="checkbox" ${isChecked}> ${habits[i].name} (last done : ${lastDoneContent})</div>`;
        if(isHabitCompletedToday(habits[i].id)){
            
        }
    }
    
    
    habitsContainerElement.innerHTML=habitsHTML;
}

export function isHabitCompletedToday(habitID){
    let habit = getHabitByID(habitID)[0];
    return habit.lastDone == dateToYMD(new Date()); 

}

habitsContainerElement.addEventListener('click', btn => {
    const habitID = btn.target.parentNode.dataset.id;
    if(btn.target.checked){
        btn.target.parentNode.classList.add("done"); 
        updateHabit(habitID); 
        displayHabits();
    }
    else{btn.target.parentNode.classList.remove("done"); }
});

displayHabits();