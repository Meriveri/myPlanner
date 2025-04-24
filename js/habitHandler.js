import { addHabit, getHabitByID, getHabits, updateHabit, uncheckHabit } from "./habitService.js";
import { addXDaysToDate, dateToYMD, getDayDifference } from "./utils.js";

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

export function isTodayOrDate(date){
    if(date == dateToYMD(new Date())){return `<span class="borderBubble">today</span>`;}
    
    return date;
}

export function isUrgent(habit){
    const frequency = habit.frequency;
    let logs = habit.log;
    let lastLog = new Date(logs[logs.length-1]);
    const today = new Date();

    const diff = Math.trunc(getDayDifference(lastLog, today));
    
    if(diff > 0){return "late";}
    if(!Number.isInteger(diff)){return "today";}
    return "";
}

export function displayHabits(){
    const habits = getHabits();
    let habitsHTML = "";
    for(let i = 0; i<habits.length;i++){
        let lastDoneDate = logEmpty(habits[i]);

        let nextDue = nextDueDate(habits[i].lastDone, habits[i].frequency);
        nextDue = isTodayOrDate(nextDue); 
        if(habits[i].log.length==0){nextDue = "today"};

        let isChecked = isHabitCompletedToday(habits[i].id) ? "checked" : "";
        habitsHTML+= `<div class = "habit ${isUrgent(habits[i])}" data-id="${habits[i].id}">
        <input type="checkbox" ${isChecked}> 
        <span style="font-weight:bold;"> ${habits[i].name} </span><br/>
        <span style="font-size:14px;">last done : ${lastDoneDate} next due : ${nextDue}</span></div>`;
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
    id : "habit-3",
    name : "cheat", 
    createdAt : dateToYMD(new Date("2025-04-20")),
    frequency : 1, 
    lastDone : "2025-04-22",
    log : ["2025-04-20", "2025-04-22"], 
    streak : {current : 2, longest : 2}, 
    archived : false
}
addHabit(habit);*/