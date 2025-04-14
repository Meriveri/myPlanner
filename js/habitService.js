export function getHabits() {
    return JSON.parse(localStorage.getItem("habits")) || [];
}

export function addHabits(habit) {
    const habits = getHabits();
    habits.push(habit);
    localStorage.setItem("habits", JSON.stringify(habits));
}

export function deleteAllHabits(){
    
}