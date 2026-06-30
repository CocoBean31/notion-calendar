const CLIENT_ID = "973350846269-1uhhhbjp50gh89k0egso0o3aifrndvie.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

let currentDate = new Date();
let tokenClient = null;
let accessToken = "";

const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function renderWeek() {
  const monday = getMonday(currentDate);
  const sunday = addDays(monday, 6);
  const options = { day: "numeric", month: "long" };

  document.getElementById("week-title").textContent =
    `${monday.toLocaleDateString("en-GB", options)} - ${sunday.toLocaleDateString("en-GB", options)}`;

  document.querySelectorAll(".day").forEach((dayElement, i) => {
    const date = addDays(monday, i);
    dayElement.querySelector(".weekday").textContent = weekdays[i];
    dayElement.querySelector(".date").textContent = date.getDate();
  });

  clearEvents();
  if (accessToken) loadGoogleEvents();
}

function setupButtons() {
  document.getElementById("prevWeek").addEventListener("click", () => {
    currentDate = addDays(currentDate, -7);
    renderWeek();
  });

  document.getElementById("nextWeek").addEventListener("click", () => {
    currentDate = addDays(currentDate, 7);
    renderWeek();
  });

  document.getElementById("todayBtn").addEventListener("click", () => {
    currentDate = new Date();
    renderWeek();
  });

  document.querySelectorAll(".day").forEach((day) => {
    day.addEventListener("click", () => {
      document.querySelectorAll(".day").forEach((otherDay) => {
        if (otherDay !== day) otherDay.classList.remove("active");
      });
      day.classList.toggle("active");
    });
  });
}

function setupGoogleCalendar() {

  tokenClient = google.accounts.oauth2.initTokenClient({

    client_id: CLIENT_ID,

    scope: SCOPES,

    callback: (response) => {

      if (response.error) {
        alert("Google error: " + response.error);
        return;
      }

      accessToken = response.access_token;

      const connectBtn = document.getElementById("connectBtn");

      connectBtn.textContent = "↻ Refresh";
      connectBtn.classList.add("connected");

      loadGoogleEvents();

    }

  });

  const connectBtn = document.getElementById("connectBtn");

  connectBtn.addEventListener("click", () => {

    // Already connected? Just refresh events.
    if (accessToken) {

      clearEvents();
      loadGoogleEvents();
      return;

    }

    // First-time connection
    tokenClient.requestAccessToken({
      prompt: ""
    });

  });

}

async function loadGoogleEvents() {
  clearEvents();

  const monday = getMonday(currentDate);
  const nextMonday = addDays(monday, 7);
  const calendars = await getCalendars();

  for (const calendar of calendars) {
    const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar.id)}/events`);
    url.searchParams.set("timeMin", monday.toISOString());
    url.searchParams.set("timeMax", nextMonday.toISOString());
    url.searchParams.set("singleEvents", "true");
    url.searchParams.set("orderBy", "startTime");

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) continue;

    const data = await response.json();
    renderGoogleEvents(data.items || [], monday, calendar.backgroundColor);
  }
  updateEventBadges();
  }
  function updateEventBadges() {
  
}
    document.querySelectorAll(".day").forEach((day, index) => {

        let dots = day.querySelector(".event-dots");

        // Create the dots container if it doesn't exist
        if (!dots) {

            dots = document.createElement("div");
            dots.className = "event-dots";

            // Place it underneath the header
            day.querySelector(".day-header").insertAdjacentElement("afterend", dots);

        }

        // Clear existing dots
        dots.innerHTML = "";

        // Get all events for this day
        const events = document.querySelectorAll(`#events-${index} .event`);

        // Show up to 5 dots
        const visibleDots = Math.min(events.length, 5);

        for (let i = 0; i < visibleDots; i++) {

            const dot = document.createElement("span");

            dot.className = "event-dot";

            // Use the Google Calendar colour stored on the event
            dot.style.backgroundColor = events[i].dataset.color || "#7E80FF";

            dots.appendChild(dot);

        }

        // Add a + if there are more than 5 events
        if (events.length > 5) {

            const plus = document.createElement("span");

            plus.className = "event-plus";

            plus.textContent = "+";

            dots.appendChild(plus);

        }

    });

}

async function getCalendars() {
  const response = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    alert("Could not load your calendar list.");
    return [{ id: "primary", backgroundColor: "#2f2f2f" }];
  }

  const data = await response.json();
  const calendars = (data.items || []).filter((calendar) => calendar.primary || calendar.selected);

  return calendars.length ? calendars : [{ id: "primary", backgroundColor: "#2f2f2f" }];
}

function renderGoogleEvents(events, monday, color) {
  events.forEach((event) => {
    const startValue = event.start.dateTime || event.start.date;
    const startDate = event.start.date ? localDate(startValue) : new Date(startValue);
    const dayIndex = Math.floor((startOfDay(startDate) - startOfDay(monday)) / 86400000);

    if (dayIndex < 0 || dayIndex > 6) return;

    const container = document.getElementById(`events-${dayIndex}`);
    if (!container) return;

    const eventEl = document.createElement("div");

eventEl.className = "event";
eventEl.dataset.color = color || "#7E80FF";

eventEl.style.borderLeftColor = color || "#2f2f2f";
eventEl.style.backgroundColor = hexToRgba(color || "#2f2f2f", 0.12);

    const timeEl = document.createElement("div");
    timeEl.className = "event-time";
    timeEl.textContent = event.start.date ? "All day" : formatTime(startDate);

    const titleEl = document.createElement("div");
    titleEl.className = "event-title";
    titleEl.textContent = event.summary || "Untitled event";

    eventEl.appendChild(timeEl);
    eventEl.appendChild(titleEl);
    container.appendChild(eventEl);
  });
}

function hexToRgba(hex, alpha) {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function clearEvents() {
  document.querySelectorAll(".events").forEach((container) => {
    container.innerHTML = "";
  });
}

function getMonday(date) {
  const monday = startOfDay(date);
  const day = monday.getDay();
  monday.setDate(monday.getDate() + (day === 0 ? -6 : 1 - day));
  return monday;
}

function startOfDay(date) {
  const output = new Date(date);
  output.setHours(0, 0, 0, 0);
  return output;
}

function addDays(date, days) {
  const output = new Date(date);
  output.setDate(output.getDate() + days);
  return output;
}

function localDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatTime(date) {
  return date.toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
  });
}

setupButtons();
renderWeek();
window.addEventListener("load", setupGoogleCalendar);
