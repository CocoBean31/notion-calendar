document.addEventListener("DOMContentLoaded", () => {

    console.log("✅ Planner Loaded");

    const days = document.querySelectorAll(".day");

    console.log(`Found ${days.length} days`);

    days.forEach(day => {

        day.addEventListener("click", () => {

            console.log("Clicked!");

            if (day.classList.contains("active")) {

                day.classList.remove("active");

            } else {

                days.forEach(d => d.classList.remove("active"));
                day.classList.add("active");

            }

        });

    });

});
