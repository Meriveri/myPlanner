import { getDLEvents } from "./deadlineEventService.js";
import { getHabits } from "./habitService.js";




export function deleteHabit(id, index){
    let habits = getHabits();
    let habit = habits.filter(h => h.id == id)[0];
    
    habits.splice(index, 1);

    localStorage.setItem("habits", JSON.stringify(habits));
}

export function editHabitName(id, name){
    let habits = getHabits();
    let habit = habits.filter(h => h.id == id);
    habit = habit[0];

    habit.name = name;

    localStorage.setItem("habits", JSON.stringify(habits));
}


export function editHabitFrequency(id, frequency){
    let habits = getHabits();
    let habit = habits.filter(h => h.id == id);
    habit = habit[0];

    habit.frequency.value = frequency.value;

    localStorage.setItem("habits", JSON.stringify(habits));

}

export function archiveHabit(id){
    let habits = getHabits();
    let habit = habits.filter(h=> h.id == id);
    habit = habit[0];
    console.log(habit.archived);
    if(habit.archived){habit.archived = false; }
    else{habit.archived = true;}

    localStorage.setItem("habits", JSON.stringify(habits));
}



export function deleteDLEvent(id, index){
    let DLEvents = getDLEvents();
    let DLEvent = DLEvents.filter(e => e.id == id)[0];
    
    DLEvents.splice(index, 1);

    localStorage.setItem("DLEvents", JSON.stringify(DLEvents));

}

export function editDLEventTitle(id, title){
    let DLEvents = getDLEvents();
    let DLEvent = DLEvents.filter(e => e.id == id)[0];

    DLEvent.title = title;

    localStorage.setItem("DLEvents", JSON.stringify(DLEvents));

}

export function editDLEventDueDate(id, dueDate){
    let DLEvents = getDLEvents();
    let DLEvent = DLEvents.filter(e => e.id == id)[0];

    DLEvent.dueDate = dueDate;

    localStorage.setItem("DLEvents", JSON.stringify(DLEvents));


}

export function editDLEventChecklist(DLEventId, indexOfTask, newTitle){
    const DLEvents = getDLEvents();
    const DLEvent = DLEvents.filter(e => e.id == DLEventId)[0];
    console.log(newTitle);

    DLEvent.checklist[indexOfTask].title = newTitle;

    localStorage.setItem("DLEvents", JSON.stringify(DLEvents));

}

export function deleteDLEventChecklist(index){
    const DLEvents = getDLEvents();

    localStorage.setItem("DLEvents", JSON.stringify(DLEvents));
}
