const CLIENT_ID = "973350846269-1uhhhbjp50gh89k0egso0o3aifrndvie.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/calendar.events.readonly";

let currentDate = new Date();
let tokenClient = null;
let accessToken = "";

const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function renderWeek() {
  const monday = new Date(currentDate);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  monday.setDate(monday.getDate() + diff);

  updateHeader(monday);

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
    month: "long",
  };

  document.getElementById("week-title").textContent =
    `${monday.toLocaleDateString("en-GB", options)} - ${sunday.toLocaleDateString("en-GB", options)}`;
}

function setupButtons() {
  document.getElementById("prevWeek").addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() - 7);
    renderWeek();
  });

  document.getElementById("nextWeek").addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() + 7);
    renderWeek();
  });

  document.getElementById("todayBtn").addEventListener("click", () => {
    currentDate = new Date();
    renderWeek();
  });

  document.querySelectorAll(".day").forEach((day) => {
    day.addEventListener("click", () => {
      document.querySelectorAll(".day").forEach((d) => {
        if (d !== day) d.classList.remove("active");
      });

      day.classList.toggle("active");
    });
  });
}

function setupGoogleCalendar() {
  if (!window.google || !google.accounts || !google.accounts.oauth2) {
    console.warn("Google sign-in is not ready.");
    return;
  }

  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (response) => {
      if (response.error) {
        console.error(response);
        return;
      }

      accessToken = response.access_token;
      document.getElementById("connectBtn").textContent = "✓ Connected";
    },
  });

  document.getElementById("connectBtn").addEventListener("click", () => {
    tokenClient.requestAccessToken({
      prompt: accessToken ? "" : "consent",
    });
  });
}

setupButtons();
renderWeek();
window.addEventListener("load", setupGoogleCalendar);
