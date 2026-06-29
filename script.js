// ===========================
// Weekly Planner
// ===========================

// Current week being viewed
let currentDate = new Date();

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

    const week = document.getElementById("week");


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

    };

    document.getElementById("week-title").textContent =

        `${monday.toLocaleDateString("en-GB", options)} – ${sunday.toLocaleDateString("en-GB", options)}`;

}
document
.getElementById("prevWeek")
.addEventListener("click", () => {

    currentDate.setDate(currentDate.getDate() - 7);

    renderWeek();

});

document
.getElementById("nextWeek")
.addEventListener("click", () => {

    currentDate.setDate(currentDate.getDate() + 7);

    renderWeek();

});

document
.getElementById("todayBtn")
.addEventListener("click", () => {

    currentDate = new Date();

    renderWeek();

    // ===========================
// Previous week
// ===========================

document
.getElementById("prevWeek")
.addEventListener("click", () => {

    currentDate.setDate(currentDate.getDate() - 7);

    renderWeek();

});

// ===========================
// Next week
// ===========================

document
.getElementById("nextWeek")
.addEventListener("click", () => {

    currentDate.setDate(currentDate.getDate() + 7);

    renderWeek();

});

// ===========================
// Today
// ===========================

document
.getElementById("todayBtn")
.addEventListener("click", () => {

    currentDate = new Date();

    renderWeek();

});

// ===========================
// Expand / Collapse Days
// ===========================

const days = document.querySelectorAll(".day");

days.forEach(day => {

    day.addEventListener("click", () => {

        if (day.classList.contains("active")) {

            day.classList.remove("active");

            return;

        }

        days.forEach(d => d.classList.remove("active"));

        day.classList.add("active");

    });

});

// ===========================
// Initialise Planner
// ===========================

renderWeek();

});
  renderWeek();
