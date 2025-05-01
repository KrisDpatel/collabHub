document.querySelector(".signup-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = document.querySelector(".signup-form");
  const formData = new FormData(form); // collect all form data including file

  try {
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      body: formData, // don't set Content-Type manually
    });

    const data = await res.json();

    if (res.status === 201) {
      alert("Signup Successful ✅");
      form.reset();
      document.getElementById("preview-img").src = "../photo/photo.png"; // reset preview
    } else {
      alert("Signup Failed ❌: " + data.message);
    }
  } catch (err) {
    console.error("Error:", err);
    // alert("Signup Failed. Server Error ❌");
  }
});
