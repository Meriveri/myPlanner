import { addHabit, getHabitByID, getHabits, updateHabit, uncheckHabit, lateCheckIn } from "./habitService.js";
import { addXDaysToDate, dateToYMD, getDayDifference } from "./utils.js";
import { getPoints, updatePoints } from "./gatchaService.js";
import { displayPoints, isAllDailyHabitsDone, lastHabitIsUnchecked } from "./gatchaHandler.js";
import { getHabitsLog, addToHabitsLog } from "./habitService.js";

const habitsContainerElement = document.getElementById("habitsContainer");

const habitNameElement = document.getElementById("habitName");

const frequencyTypeElement = document.getElementById("frequencyType");
frequencyTypeElement.value = "everyXDays";

let frequencyFieldsElement = document.getElementById("frequencyFields");
frequencyFieldsElement.innerHTML=`<input type="number" id ="period" placeholder="every x days"/>`;

let periodElement = document.getElementById("period");
const addHabitBtn = document.getElementById("addHabit");

const newHabitBtn = document.getElementById("newHabit");
const formElement = document.getElementById("habitForm");

const habitsFilterElement = document.getElementById("habitsFilter");

newHabitBtn.addEventListener('click', () => {formElement.classList.toggle("visible");});

addHabitBtn.addEventListener("click", ()=>{createHabit(); });

//display form
frequencyTypeElement.addEventListener('change', ()=>{
    if(frequencyTypeElement.value == "everyXDays"){
        frequencyFieldsElement.innerHTML=`<input type="number" id ="period" placeholder="every x days"/>`;
    }
    if(frequencyTypeElement.value == "xTimesPerDay"){
        frequencyFieldsElement.innerHTML=`<input type="number" id ="times" placeholder="x times a day"/>`;
    }
    if(frequencyTypeElement.value == "xTimesPerPeriod"){
        frequencyFieldsElement.innerHTML=`<input type="number" id ="times" placeholder="x times"/><input type="number" id ="period" placeholder="period"/>`;
    }
})

//calculate next due date
export function nextDueDate(date, days){
    if(date != ""){date = new Date(date);}
    else{date = new Date();}
    return addXDaysToDate(date, days);
}

export function createHabit(){
    const habits = getHabits();
    let habitID = "habit-0";
    
    //find ID
    if(habits.length>=1){
        const prevID = habits[habits.length-1].id;
        const newIDIndex = parseInt(prevID.split("-")[1])+1;
        habitID = "habit-"+newIDIndex;
    }

    //build habit
    const timesElement = document.getElementById("times");
    
    let habitName = habitNameElement.value;
    let frequencyType = frequencyTypeElement.value;
    let frequency = "1";
    
    let period = "1";
    if(frequencyType=="xTimesPerDay"){frequency = timesElement.value;}
    else{period = periodElement.value;}

    let startingDay = new Date().getDay();


    const habit = {
        id : habitID,
        name : habitName, 
        createdAt : dateToYMD(new Date()),
        frequency : {type: frequencyType, frequency: frequency, period: period, from: startingDay}, 
        lastDone : "",
        nextDue : dateToYMD(new Date()),
        log : [],
        streak : {current : 0, longest : 0}, 
        archived : false
    }

    //create habit if fields not empty
    if(habit.frequency.type == "everyXDays"){
        if( habit.name != "" && habit.frequency.period > 0){
            habitNameElement.classList.remove("invalidField"); 
            periodElement.classList.remove("invalidField");  
            addHabit(habit);
        }
        //error message if fields are empty
        else{
            console.log("denied in wrong type");
            habitNameElement.classList.remove("invalidField"); 
            periodElement.classList.remove("invalidField");  
            if(habit.name == "" ){habitNameElement.classList.add("invalidField");} 
            if(habit.frequency.period <= 0){periodElement.classList.add("invalidField");}
        }
    }

    if(habit.frequency.type == "xTimesPerDay"){
        if( habit.name != "" && habit.frequency.frequency > 0){
            habitNameElement.classList.remove("invalidField"); 
            periodElement.classList.remove("invalidField");  
            addHabit(habit);
        }
        //error message if fields are empty
        else{
            console.log(habit.frequency.frequency);
            habitNameElement.classList.remove("invalidField"); 
            timesElement.classList.remove("invalidField");  
            if(habit.name == "" ){habitNameElement.classList.add("invalidField");} 
            if(habit.frequency.frequency <= 0){periodElement.classList.add("invalidField");}
        }
    }
    lastHabitIsUnchecked();
    displayPoints();
    displayHabits();

}

//display never for habits never done
export function showLogEmpty(habit){
    return habit.lastDone == "" ? "never" : habit.lastDone;
}

//bubble for habits due today
export function showIsTodayOrDate(date){
    if(date == dateToYMD(new Date())){return `<span class="borderBubble">today</span>`;}
    
    return date;
}

//bubble for late habits
export function showIsHabitLate(habit){
    let habitDueDate = new Date(habit.nextDue);
    let today = new Date();
    let diff = Math.trunc(getDayDifference(habitDueDate, today));
    if(diff > 0){return `<span class="borderBubble">late</span>`}
    return "";
}

//mark habits as done and attribute points
export function showIsHabitCompletedToday(habitID){
    let habit = getHabitByID(habitID)[0];
    return habit.lastDone == dateToYMD(new Date()); 

}

//change card color 
export function isDueColor(habit) {
    const todayStr = dateToYMD(new Date());
    const dueStr = dateToYMD(new Date(habit.nextDue));

    if (todayStr > dueStr) return "late";
    if (todayStr === dueStr) return "today";
    return "";
}

//filter for hiding habits not due
habitsFilterElement.addEventListener('change', () =>{
    displayHabits();
});

//display habits
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
        let lastDoneDate = showLogEmpty(habits[i]);
        let isLate = showIsHabitLate(habits[i]);

        let nextDue = habits[i].nextDue;
        nextDue = showIsTodayOrDate(nextDue); 
        if(habits[i].log.length==0){nextDue = `<span class="borderBubble">today</span>`;}

        let isChecked = showIsHabitCompletedToday(habits[i].id) ? "checked" : "";
        habitsHTML+= `<div class = "habit ${isDueColor(habits[i])}" data-id="${habits[i].id}">    
        <div class="habitHead"> 
            <div class="habitInfo">
                <input type="checkbox" ${isChecked}>
                <span class="habitName"> ${habits[i].name} ${isLate}</span>
            </div>
            <button class="lateCheckIn"><i class="fa-solid fa-hourglass-end"></i></button>
        </div>
        <span style="font-size:14px;">last done : ${lastDoneDate} next due : ${nextDue}</span></div>`;
    }
    
    habitsContainerElement.innerHTML=habitsHTML;
}

//check/uncheck listener
habitsContainerElement.addEventListener('change', checkedHabit => {
    const habitID = checkedHabit.target.parentNode.parentNode.parentNode.dataset.id;
    const points = getPoints();
    
    if(checkedHabit.target.checked){     
        checkedHabit.target.parentNode.classList.add("done"); 
        updateHabit(habitID); 
        isAllDailyHabitsDone();
        updatePoints(5);
        displayHabits();
        displayPoints();
    }
    else{
        checkedHabit.target.parentNode.classList.remove("done"); 
        uncheckHabit(habitID); 
        lastHabitIsUnchecked();
        updatePoints(-5);
        displayHabits();
        displayPoints();
    }
    
});

//late check in listener
habitsContainerElement.addEventListener('click', (lateCheckInBtn) => {
    const button = lateCheckInBtn.target.parentNode;
    if(button.classList.contains("lateCheckIn")){
        const id = button.parentNode.parentNode.dataset.id;
        lateCheckIn(id);
        updatePoints(5);
        displayPoints();
        displayHabits();
    }
})

export function getHabitsLogById(id){
    const habits = getHabitsLog();

    return habits.filter(h => h.id == id);
    
}

export function logOfThisDayByID(id, date){
    const logs = getHabitsLog();
    const thisDayLogs = logs.filter(l => l.id == id && l.doneOn == date);

    return thisDayLogs;

}

export function showCheckForFrequencyTypes(habit){
    const logs = getHabitsLogById();
    const id = habit.id;
    const log = getHabitByID(id);
    const allHabits = document.querySelectorAll(".habit.today");

    if(habit.frequency.type == "xTimesPerDay"){
        const habitElement = Array.from(allHabits).find(h => h.dataset.id === id);
        const habitInfo = habitElement.querySelector(".habitInfo");
        const defaultValue = logOfThisDayByID(id, dateToYMD(new Date())).length;
        habitInfo.innerHTML = `
                <input type="number" class="habitCount" min="0" value="${defaultValue}"><span class="timesDone">/${habit.frequency.frequency}</span>
                <span class="habitName"> ${habit.name} </span>`
    }
}

habitsContainerElement.addEventListener('change', (btn) => {
    if(btn.target.classList.contains("habitCount")){
        const id = btn.target.closest(".habit").dataset.id;

        const allHabits = document.querySelectorAll(".habit.today");
        const habitElement = Array.from(allHabits).find(h => h.dataset.id === id);

        const time = habitElement.querySelector(".habitCount").value;
        if(time != 0){addToHabitsLog(id, time);}
        
        

    }
})
displayHabits();

const habits = getHabits()
showCheckForFrequencyTypes(habits[8]);