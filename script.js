// ======================================
// Weekly Planner
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    const days = document.querySelectorAll(".day");

    days.forEach(day => {

        day.addEventListener("click", () => {

            // Collapse if clicking the same day
            if (day.classList.contains("active")) {

                day.classList.remove("active");
                return;

            }

            // Close all other days
            days.forEach(d => d.classList.remove("active"));

            // Open clicked day
            day.classList.add("active");

        });

    });

});

// ======================================
// Google Calendar
// (Coming next)
// ======================================

// Leave these as placeholders for now.
// We'll replace them once the click behaviour works again.

const CLIENT_ID = "YOUR_OAUTH_CLIENT_ID";
const API_KEY = "YOUR_API_KEY";

const DISCOVERY_DOC =
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

const SCOPES =
    "https://www.googleapis.com/auth/calendar.readonly";

function initGoogleCalendar() {

    console.log("Google Calendar integration coming soon.");

}
