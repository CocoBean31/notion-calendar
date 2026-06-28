// ======================================
// Weekly Planner
// ======================================

// Select all day columns
const days = document.querySelectorAll(".day");

// Expand / collapse days
days.forEach(day => {

    day.addEventListener("click", () => {

        // If already open, close it
        if (day.classList.contains("active")) {

            day.classList.remove("active");
            return;

        }

        // Close every other day
        days.forEach(d => d.classList.remove("active"));

        // Open selected day
        day.classList.add("active");

    });

});

// ======================================
// Google Calendar
// (Coming next)
// ======================================

const CLIENT_ID = "YOUR_OAUTH_CLIENT_ID";
const API_KEY = "YOUR_API_KEY";

const DISCOVERY_DOC =
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

const SCOPES =
    "https://www.googleapis.com/auth/calendar.readonly";

// Initialise Google API
function initGoogleCalendar() {

    console.log("Google Calendar initialisation coming next...");

}
