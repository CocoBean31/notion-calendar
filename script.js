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

    week.innerHTML = "";

    // Find Monday
    const monday = new Date(currentDate);

    const day = monday.getDay();

    const diff = day === 0 ? -6 : 1 - day;

    monday.setDate(monday.getDate() + diff);

    // Update title
    updateHeader(monday);

    // Generate seven days
    for (let i = 0; i < 7; i++) {

        const date = new Date(monday);

        date.setDate(monday.getDate() + i);

        week.appendChild(createDay(date, i));

    }

}
function createDay(date, index) {

    const day = document.createElement("div");

    day.className = "day";

    day.innerHTML = `

        <div class="day-header">

            <span class="weekday">
                ${weekdays[index]}
            </span>

            <span class="date">
                ${date.getDate()}
            </span>

        </div>

        <div class="events">

        </div>

    `;

    day.addEventListener("click", () => {

        document
            .querySelectorAll(".day")
            .forEach(d => d.classList.remove("active"));

        day.classList.add("active");

    });

    return day;

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

});
