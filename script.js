<script>

const days = document.querySelectorAll(".day");

days.forEach(day => {

    day.addEventListener("click", () => {

        // Close if the same day is clicked again
        if (day.classList.contains("active")) {

            day.classList.remove("active");
            return;

        }

        // Collapse every day
        days.forEach(d => d.classList.remove("active"));

        // Expand the clicked day
        day.classList.add("active");

    });

});

</script>
