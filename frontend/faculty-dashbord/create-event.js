document.getElementById("eventForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const form = document.getElementById("eventForm");
    const formData = new FormData(form);
  
    try {
      const res = await fetch("http://localhost:5000/api/event/create", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert( "Event created successfully!");
        form.reset();
      } else {
        alert("Failed to create event.");
      }
    } catch (err) {
      console.error("Error:", err);
     alert( "An error occurred.");
    }
  });
  