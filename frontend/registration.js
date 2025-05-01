document.querySelector(".registration-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = document.querySelector(".registration-form");
    const formData = new FormData(form); // collect all form data including file

    try {
        const res = await fetch("http://localhost:5000/api/auth/registeration", {
            method: "POST",
            body: formData, // don't set Content-Type manually
        });

        const data = await res.json();

        if (res.status === 201) {
            alert("registration Successful ✅");
            form.reset();
            window.location.href = "/event_student.html";
        } else {
            alert("registration Failed ❌: " + data.message);
        }
    } catch (err) {
        console.error("Error:", err);
        // alert("Signup Failed. Server Error ❌");
    }
});
