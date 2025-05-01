import { getDLEvents } from "./deadlineEventService.js";
import { getCompletedEvents } from "./eventService.js";
import { getPoints, initPoints, updatePoints } from "./gatchaService.js";
import { getHabits } from "./habitService.js";
import { dateToYMD } from "./utils.js";

export function calculatePastPoints(){
    const today = dateToYMD(new Date());

    let habits = getHabits();
    let DLEvents = getDLEvents();
    let events = getCompletedEvents();
    let checklists = [];
    
    habits = habits.filter (h => h.lastDone <= today);
    events = events.filter( e => e.date <= today);

    for(let i = 0; i< DLEvents.length;i++){
        checklists = DLEvents[i].checklist;
        checklists = checklists.filter(c => c.completedOn <= today);
        
    }
    
    DLEvents = DLEvents.filter(e => e.completed == true);

    const habitsPoints = 5*habits.length;
    const DLEventsPoints = 20*DLEvents.length;
    const checklistsPoints = 5*checklists.length;
    const eventsPoints = 15*events.length;

    console.log("habits points ", habitsPoints, " DLEventsPoits ", DLEventsPoints, " checklistPoinst", checklistsPoints, " eventsPoints", eventsPoints);
    const totalPoints = habitsPoints+DLEventsPoints+eventsPoints+checklistsPoints;
    return totalPoints;

}

initPoints();
