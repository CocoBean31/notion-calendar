const CLIENT_ID = "973350846269-1uhhhbjp50gh89k0egso0o3aifrndvie.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/calendar.events.readonly";

// ===========================
// Weekly Planner
// ===========================

// Current week being viewed
let currentDate = new Date();
let tokenClient = null;
let accessToken = "";

// Weekday names
const weekdays = [
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT",
    "SUN"
];

// ===========================
// Render Week
// ===========================

function renderWeek() {


    // Find Monday
    const monday = new Date(currentDate);

    const day = monday.getDay();

    const diff = day === 0 ? -6 : 1 - day;

    monday.setDate(monday.getDate() + diff);

    // Update title
    updateHeader(monday);

    // Generate seven days
    const days = document.querySelectorAll(".day");

days.forEach((dayElement, i) => {

    const date = new Date(monday);

    date.setDate(monday.getDate() + i);

    dayElement.querySelector(".weekday").textContent = weekdays[i];

    dayElement.querySelector(".date").textContent = date.getDate();

});

}

function updateHeader(monday) {

    const sunday = new Date(monday);

    sunday.setDate(monday.getDate() + 6);

    const options = {

        day: "numeric",

        month: "long"

    document.getElementById("week-title").textContent =

        `${monday.toLocaleDateString("en-GB", options)} – ${sunday.toLocaleDateString("en-GB", options)}`;

}

// ===========================
// Previous Week
// ===========================

document.getElementById("prevWeek").addEventListener("click", () => {

    currentDate.setDate(currentDate.getDate() - 7);

    renderWeek();

});

// ===========================
// Next Week
// ===========================

document.getElementById("nextWeek").addEventListener("click", () => {

    currentDate.setDate(currentDate.getDate() + 7);

    renderWeek();

});

// ===========================
// Today
// ===========================

document.getElementById("todayBtn").addEventListener("click", () => {

    currentDate = new Date();

    renderWeek();

});

// ===========================
// Expand / Collapse
// ===========================

document.querySelectorAll(".day").forEach(day => {

    day.addEventListener("click", () => {

        document.querySelectorAll(".day").forEach(d => {

            if (d !== day) d.classList.remove("active");

        });

        day.classList.toggle("active");

    });

});

// ===========================
// Initialise
// ===========================

renderWeek();

