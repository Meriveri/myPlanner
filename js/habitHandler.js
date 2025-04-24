import { addHabit, getHabitByID, getHabits, updateHabit, uncheckHabit } from "./habitService.js";
import { addXDaysToDate, dateToYMD } from "./utils.js";

const habitsContainerElement = document.getElementById("habitsContainer");

const habitNameElement = document.getElementById("habitName");
const habitFrequencyElement = document.getElementById("habitFrequency");
const addHabitBtn = document.getElementById("addHabit");

const newHabitBtn = document.getElementById("newHabit");
const formElement = document.getElementById("habitForm");

newHabitBtn.addEventListener('click', () => {
    formElement.classList.toggle("visible");  
});

addHabitBtn.addEventListener("click", ()=>{createHabit();});


export function createHabit(){
    const habits = getHabits();
    const habitID = "habit-"+habits.length;
    let habitName = habitNameElement.value;
    let habitFreq = habitFrequencyElement.value;
    const habit = {
        id : habitID,
        name : habitName, 
        createdAt : dateToYMD(new Date()),
        frequency : habitFreq, 
        lastDone : "",
        log : [], 
        streak : {current : 0, longest : 0}, 
        archived : false
    }
    addHabit(habit);
    displayHabits();

}

export function logEmpty(habit){
    return habit.lastDone == "" ? "never" : habit.lastDone;
}

export function nextDueDate(date, days){
    if(date != ""){date = new Date(date);}
    else{date = new Date();}
    return addXDaysToDate(date, days);
}

export function displayHabits(){
    const habits = getHabits();
    let habitsHTML = "";
    for(let i = 0; i<habits.length;i++){
        let lastDoneDate = logEmpty(habits[i]);
        let nextDue = nextDueDate(habits[i].lastDone, habits[i].frequency);
        let isChecked = isHabitCompletedToday(habits[i].id) ? "checked" : "";
        habitsHTML+= `<div class = "habit" data-id="${habits[i].id}"><input type="checkbox" ${isChecked}> <span style="font-weight:bold;"> ${habits[i].name} </span><br/><span style="font-size:14px;">last done : ${lastDoneDate} next due : ${nextDue}</div></span>`;
    }
    
    habitsContainerElement.innerHTML=habitsHTML;
}

export function isHabitCompletedToday(habitID){
    let habit = getHabitByID(habitID)[0];
    return habit.lastDone == dateToYMD(new Date()); 

}

habitsContainerElement.addEventListener('change', btn => {
    const habitID = btn.target.parentNode.dataset.id;
    if(btn.target.checked){     
        btn.target.parentNode.classList.add("done"); 
        updateHabit(habitID); 
        displayHabits();
    }
    else{
        btn.target.parentNode.classList.remove("done"); 
        uncheckHabit(habitID); 
        displayHabits();
    }
    
});



displayHabits();
/*const habit = {
    id : "habit-0",
    name : "cheat", 
    createdAt : dateToYMD(new Date("2025-04-20")),
    frequency : 2, 
    lastDone : "2025-04-22",
    log : ["2025-04-20", "2025-04-22"], 
    streak : {current : 1, longest : 1}, 
    archived : false
}
addHabit(habit);*/