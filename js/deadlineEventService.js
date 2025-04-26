export function getDLEvents(){
    return JSON.parse(localStorage.getItem("DLEvents")) || [];
}

export function addDLEvent(event){
    const events = getDLEvents();
    events.push(event);

    localStorage.setItem("DLEvents", JSON.stringify(events));

}

export function deleteAllDLEvents(){
    localStorage.removeItem("DLEvents");
}