export function getPoints(){
    return JSON.parse(localStorage.getItem("points")) || { value : 0 };
}

export function initPoints(){
    const points = getPoints();
    if(points.value === undefined){
        const initial = {value : 0};
        localStorage.setItem("points", JSON.stringify(initial));
    }
}

export function updatePoints(pointsToAdd){
    const points = getPoints();
    points.value += pointsToAdd - points.value;
    localStorage.setItem("points", JSON.stringify(points));
}