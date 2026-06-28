document.addEventListener("DOMContentLoaded", () => {

    console.log("✅ Planner Loaded");

    // -----------------------
    // Expand / Collapse Days
    // -----------------------

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

    // -----------------------
    // Google Authentication
    // -----------------------

    const CLIENT_ID = "PASTE_YOUR_CLIENT_ID_HERE";

    let tokenClient;

    tokenClient = google.accounts.oauth2.initTokenClient({

        client_id: CLIENT_ID,

        scope: "https://www.googleapis.com/auth/calendar.readonly",

        callback: (response) => {

            console.log("Connected!", response);

            document.getElementById("connectBtn").textContent =
                "✓ Connected";

        }

    });

    document.getElementById("connectBtn").addEventListener("click", () => {

        tokenClient.requestAccessToken();

    });

});
