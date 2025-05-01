import { addHabit, getHabitByID, getHabits, updateHabit, uncheckHabit } from "./habitService.js";
import { addXDaysToDate, dateToYMD, getDayDifference } from "./utils.js";
import { getPoints, updatePoints } from "./gatchaService.js";
import { displayPoints } from "./gatchaHandler.js";

const habitsContainerElement = document.getElementById("habitsContainer");

const habitNameElement = document.getElementById("habitName");
const habitFrequencyElement = document.getElementById("habitFrequency");
const addHabitBtn = document.getElementById("addHabit");

const newHabitBtn = document.getElementById("newHabit");
const formElement = document.getElementById("habitForm");

const habitsFilterElement = document.getElementById("habitsFilter");

newHabitBtn.addEventListener('click', () => {
    formElement.classList.toggle("visible");  
});

addHabitBtn.addEventListener("click", ()=>{createHabit();});


export function createHabit(){
    const habits = getHabits();
    let habitID = "habit-0";
    
    if(habits.length>=1){
        const prevID = habits[habits.length-1].id;
        const newIDIndex = parseInt(prevID.split("-")[1])+1;
        habitID = "habit-"+newIDIndex;
    }
    let habitName = habitNameElement.value;
    let habitFreq = habitFrequencyElement.value;
    const habit = {
        id : habitID,
        name : habitName, 
        createdAt : dateToYMD(new Date()),
        frequency : {type:"everyXDays", value: habitFreq}, 
        lastDone : "",
        nextDue : dateToYMD(new Date()),
        log : [], 
        streak : {current : 0, longest : 0}, 
        archived : false
    }
    if(habit.name != "" && habit.frequency.value > 0){
        habitNameElement.classList.remove("invalidField"); 
        habitFrequencyElement.classList.remove("invalidField");  
        addHabit(habit);
    }
    else{
        habitNameElement.classList.remove("invalidField"); 
        habitFrequencyElement.classList.remove("invalidField");  
        if(habit.name == "" ){habitNameElement.classList.add("invalidField");} 
        if(habit.frequency.value <= 0){habitFrequencyElement.classList.add("invalidField");}
    }
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

export function isDueColor(habit) {
    const todayStr = dateToYMD(new Date());
    const dueStr = dateToYMD(new Date(habit.nextDue));

    if (todayStr > dueStr) return "late";
    if (todayStr === dueStr) return "today";
    return "";
}

export function isHabitLate(habit){
    let habitDueDate = new Date(habit.nextDue);
    let today = new Date();
    let diff = Math.trunc(getDayDifference(habitDueDate, today));
    if(diff > 0){return `<span class="borderBubble">late</span>`}
    return "";
}


habitsFilterElement.addEventListener('change', () =>{
    displayHabits();
});

export function displayHabits(){
    let habits = getHabits();
    habits = habits.filter(h => h.archived == false);
    
    const hideNotDueIsActive = habitsFilterElement.checked;

    if(hideNotDueIsActive){
        const today = dateToYMD(new Date());
        habits = habits.filter(h => new Date(h.nextDue) <= new Date(today) || isNaN(new Date(h.lastDone)));
    }
    let habitsHTML = "";
    for(let i = 0; i<habits.length;i++){
        let lastDoneDate = logEmpty(habits[i]);
        let isLate = isHabitLate(habits[i]);

        let nextDue = habits[i].nextDue;
        nextDue = isTodayOrDate(nextDue); 
        if(habits[i].log.length==0){nextDue = `<span class="borderBubble">today</span>`;}

        let isChecked = isHabitCompletedToday(habits[i].id) ? "checked" : "";
        habitsHTML+= `<div class = "habit ${isDueColor(habits[i])}" data-id="${habits[i].id}">
        <input type="checkbox" ${isChecked}> 
        <span style="font-weight:bold;"> ${habits[i].name} ${isLate}</span> <br/>
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
    const points = getPoints();
    if(btn.target.checked){     
        btn.target.parentNode.classList.add("done"); 
        updateHabit(habitID); 
        updatePoints(5);
        displayHabits();
        displayPoints();
    }
    else{
        btn.target.parentNode.classList.remove("done"); 
        uncheckHabit(habitID); 
        updatePoints(-5);
        displayHabits();
        displayPoints();
    }
    
});



displayHabits();


