const CLIENT_ID = "973350846269-1uhhhbjp50gh89k0egso0o3aifrndvie.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/calendar.events.readonly";

let currentDate = new Date();
let tokenClient = null;
let accessToken = "";

const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function renderWeek() {
  const monday = getMonday(currentDate);
  updateHeader(monday);

  document.querySelectorAll(".day").forEach((dayElement, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);

    dayElement.querySelector(".weekday").textContent = weekdays[i];
    dayElement.querySelector(".date").textContent = date.getDate();
  });

  if (accessToken) loadGoogleEvents();
}

function updateHeader(monday) {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const options = { day: "numeric", month: "long" };

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
    alert("Google error: " + response.error);
    console.error(response);
    return;
  }

  accessToken = response.access_token;
  document.getElementById("connectBtn").textContent = "✓ Connected";
  alert("Connected. Loading events now.");
  loadGoogleEvents();
},
  });

  document.getElementById("connectBtn").addEventListener("click", () => {
    tokenClient.requestAccessToken({
      prompt: accessToken ? "" : "consent",
    });
  });
}

async function loadGoogleEvents() {
  clearEvents();

  const monday = getMonday(currentDate);
  const nextMonday = new Date(monday);
  nextMonday.setDate(monday.getDate() + 7);

  const url = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");
  url.searchParams.set("timeMin", monday.toISOString());
  url.searchParams.set("timeMax", nextMonday.toISOString());
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
  const errorText = await response.text();
  console.error("Could not load Google Calendar events:", response.status, errorText);
  alert(`Google Calendar error ${response.status}: ${errorText}`);
  return;
}

  const data = await response.json();
alert(`Google returned ${data.items ? data.items.length : 0} events for this week.`);
renderGoogleEvents(data.items || [], monday);
}

function renderGoogleEvents(events, monday) {
  events.forEach((event) => {
    const start = event.start.dateTime || event.start.date;
    const startDate = new Date(start);

    const dayIndex = Math.floor((startOfDay(startDate) - startOfDay(monday)) / 86400000);
    if (dayIndex < 0 || dayIndex > 6) return;

    const container = document.getElementById(`events-${dayIndex}`);
    if (!container) return;

    const eventEl = document.createElement("div");
    eventEl.className = "event";

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

function clearEvents() {
  document.querySelectorAll(".events").forEach((eventsContainer) => {
    eventsContainer.innerHTML = "";
  });
}

function getMonday(date) {
  const monday = new Date(date);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function startOfDay(date) {
  const output = new Date(date);
  output.setHours(0, 0, 0, 0);
  return output;
}

function formatTime(date) {
  return date.toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function setupDayExpand() {
  document.querySelectorAll(".day").forEach((day) => {
    day.addEventListener("click", () => {
      document.querySelectorAll(".day").forEach((otherDay) => {
        if (otherDay !== day) otherDay.classList.remove("active");
      });

      day.classList.toggle("active");
    });
  });
}

setupButtons();
setupDayExpand();
renderWeek();
window.addEventListener("load", setupGoogleCalendar);
