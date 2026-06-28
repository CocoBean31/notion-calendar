const CLIENT_ID = "973350846269-1uhhhbjp50gh89k0egso0o3aifrndvie.apps.googleusercontent.com";

let tokenClient = null;

let currentDate = new Date();

document.addEventListener("DOMContentLoaded", () => {

    console.log("✅ Planner Loaded");

    // --------------------
    // Expand / Collapse Days
    // --------------------
    function updateHeader() {

    const options = {
        day: "numeric",
        month: "long"
    };

    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() - currentDate.getDay() + 1);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    document.getElementById("week-title").textContent =
        `${monday.toLocaleDateString("en-GB", options)} – ${sunday.toLocaleDateString("en-GB", options)}`;

}

    const days = document.querySelectorAll(".day");

    days.forEach(day => {

        day.addEventListener("click", () => {

            if (day.classList.contains("active")) {

                day.classList.remove("active");

            } else {

                days.forEach(d => d.classList.remove("active"));
                day.classList.add("active");

            }

        });

    });

    // --------------------
    // Google Connect Button
    // --------------------

    const connectBtn = document.getElementById("connectBtn");

    connectBtn.addEventListener("click", () => {

        if (typeof google === "undefined") {

            console.error("Google Identity Services not loaded.");
            alert("Google library hasn't loaded yet. Refresh the page and try again.");

            return;

        }

        if (!tokenClient) {

            tokenClient = google.accounts.oauth2.initTokenClient({

                client_id: CLIENT_ID,

                scope: "https://www.googleapis.com/auth/calendar.readonly",

                callback: (response) => {

                    console.log("Connected!", response);

                    connectBtn.textContent = "✓ Connected";

                }

            });

        }

        tokenClient.requestAccessToken();

    });

});
