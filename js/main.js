//fix events highlight for other month 
//event highlight on event add
import { getEvents, getEventByMonth} from './eventService.js';
import { dateToYMD } from './utils.js';
import './eventsHandler.js';
import './dayDisplay.js';
import './habitHandler.js';
import './deadlineEventHandler.js';
import './gatchaHandler.js';




const monthYearElement = document.getElementById("monthYear");
const datesElement = document.getElementById("dates");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");
const resetBtn = document.getElementById("reset");
const calendarDaysElements = document.getElementsByClassName("day");

let dateShownInCalendar = new Date();

function deleteHasEventClassFromAllDays() {
    for (let x = 0; x < calendarDaysElements.length; x++) {
        calendarDaysElements[x].classList.remove("hasEvent");
    }
}

export function putDaysWithEventsInBold() {
    //array of events this months
    let events = getEvents();

    const currentYear = dateShownInCalendar.getFullYear();
    const currentMonth = dateShownInCalendar.getMonth()+1;

    events = getEventByMonth(new Date(`${currentYear}-${currentMonth}-01`));

    deleteHasEventClassFromAllDays();
    
    let calendarDay = {};
    for(let i = 0; i<calendarDaysElements.length;i++){
        let date = calendarDaysElements[i].dataset.date;
        //create an object with attribute for each day which value is the element of said date
        calendarDay[date] = calendarDaysElements[i];    
    }

    for(let j = 0; j<events.length ; j++){
        let eventDate = events[j].date;
        calendarDay[eventDate].classList.add("hasEvent");
    }
}

const updateCalendar = () => {

    const currentYear = dateShownInCalendar.getFullYear();
    const currentMonth = dateShownInCalendar.getMonth();

    const firstDay = new Date (currentYear, currentMonth, 0);
    const firstDayIndex = firstDay.getDay();
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const lastDayIndex = lastDay.getDay();

    const totalDays = lastDay.getDate();

    monthYearElement.innerHTML = dateShownInCalendar.toLocaleDateString('default', {month : 'long', year : 'numeric'});

    datesElement.innerHTML  = generateCalendarHTML(firstDayIndex, currentYear, currentMonth, totalDays, lastDayIndex);
    putDaysWithEventsInBold();
}

prevBtn.addEventListener('click', () => {dateShownInCalendar.setMonth(dateShownInCalendar.getMonth()-1); updateCalendar(); putDaysWithEventsInBold();});
nextBtn.addEventListener('click', () => {dateShownInCalendar.setMonth(dateShownInCalendar.getMonth()+1); updateCalendar(); putDaysWithEventsInBold();});
const today = new Date();
resetBtn.addEventListener('click', () => {dateShownInCalendar.setFullYear(today.getFullYear()); dateShownInCalendar.setMonth(today.getMonth()); updateCalendar();})

updateCalendar();



function generateCalendarHTML(firstDayIndex, currentYear, currentMonth, totalDays, lastDayIndex) {
    let datesHTML='';
    for (let i = firstDayIndex; i > 0; i--) {
        const prevDate = new Date(currentYear, currentMonth, 0 - i + 1);
        datesHTML += `<div class="day inactive">${prevDate.getDate()}</div>`;
    }

    for (let i = 1; i <= totalDays; i++) {
        let date = new Date(currentYear, currentMonth, i);
        const isActive = date.toDateString() === new Date().toDateString() ? 'active' : '';
        date = `${currentYear}-${currentMonth + 1}-${i}`;
        datesHTML += `<div class="day ${isActive}" data-date="${dateToYMD(date)}">${i}</div>`;
    }

    for (let i = 1; i <= 7 - lastDayIndex; i++) {
        const nextDate = new Date(currentYear, currentMonth + 1, i);
        datesHTML += `<div class="day inactive">${nextDate.getDate()}</div>`;
    }
    return datesHTML;
}

