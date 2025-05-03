import { getDLEvents } from "./deadlineEventService.js";
import { getCompletedEvents } from "./eventService.js";
import { getPoints, initPoints, updatePoints} from "./gatchaService.js";
import { getHabits } from "./habitService.js";
import { dateToYMD } from "./utils.js";

const pointsDisplaylement = document.getElementById("pointsDisplay");

export function calculatePastPoints(){
    const today = dateToYMD(new Date());

    let habits = getHabits();
    let DLEvents = getDLEvents();
    let events = getCompletedEvents();
    let checklists = [];
    
    habits = habits.filter (h => h.lastDone != "");
    events = events.filter( e => e.date <= today);

    let habitsPoints = 0;
    for(let x = 0; x<habits.length ; x++){
        habitsPoints += habits[x].log.length;
    }


    for(let i = 0; i< DLEvents.length;i++){
        checklists = DLEvents[i].checklist;
        checklists = checklists.filter(c => c.checked == "checked");
        
    }
    
    DLEvents = DLEvents.filter(e => e.completed == true);

    habitsPoints = 5*habitsPoints;
    const DLEventsPoints = 20*DLEvents.length;
    const checklistsPoints = 5*checklists.length;
    const eventsPoints = 15*events.length;

    console.log("habits points ", habitsPoints, " DLEventsPoits ", DLEventsPoints, " checklistPoinst", checklistsPoints, " eventsPoints", eventsPoints);
    const totalPoints = habitsPoints+DLEventsPoints+eventsPoints+checklistsPoints;
    return totalPoints;

}

export function displayPoints(){
    pointsDisplaylement.innerHTML = getPoints().value + " efforts";
}

export function isAllDailyHabitsDone(){

    const habitsDoneToday = getHabits().filter(e => e.lastDone == dateToYMD(new Date()));
    const habitsDueToday = getHabits().filter(e => e.nextDue == dateToYMD(new Date()));
    const totalHabitsDueToday = habitsDoneToday.length+habitsDueToday.length;

    if(Number.parseInt(habitsDoneToday.length) == Number.parseInt(totalHabitsDueToday)){updatePoints(50);}

}

export function lastHabitIsUnchecked(){
    const habitsDueToday = getHabits().filter(e => e.nextDue == dateToYMD(new Date()));
    if(Number.parseInt(habitsDueToday.length)==1){updatePoints(-50);}
}

initPoints();
displayPoints();
