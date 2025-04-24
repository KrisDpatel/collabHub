document.getElementById("eventForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const form = document.getElementById("eventForm");
    const formData = new FormData(form);
  
    try {
      const res = await fetch("http://localhost:5000/api/collab/create", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert( "Collab created successfully!");
        form.reset();
      } else {
        alert("Failed to create Your Collab.");
      }
    } catch (err) {
      console.error("Error:", err);
     alert( "An error occurred.");
    }
  });
  