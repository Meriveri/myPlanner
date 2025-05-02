import { calculatePastPoints } from "./gatchaHandler.js";

export function getPoints(){
    return JSON.parse(localStorage.getItem("points")) || { value : 0 };
}

export function initPoints(){
    const points = getPoints();
    if(points.value === undefined){
        const initial = {value : calculatePastPoints()};
        localStorage.setItem("points", JSON.stringify(initial));
    }
    else{
        if(points.value == 0){const past = calculatePastPoints();
        points.value = past;}
        localStorage.setItem("points", JSON.stringify(points));
    }
}

export function updatePoints(pointsToAdd){
    const points = getPoints();
    points.value += pointsToAdd;
    console.log("+ ",pointsToAdd );
    localStorage.setItem("points", JSON.stringify(points));
}