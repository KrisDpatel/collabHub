/* document.querySelector(".signup-form").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    // Collect form data
    const formData = {
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      institute: document.getElementById("institute").value,
      department: document.getElementById("department").value,
      mobile: document.getElementById("mobile").value,
      er_no: document.getElementById("er_no").value,
      city: document.getElementById("city").value,
      role: document.getElementById("role").value,
      semester: document.getElementById("semester").value,
      photo: document.getElementById("photo-upload").files[0] ? document.getElementById("photo-upload").files[0].name : 'default.jpg',
    };
    console.log("Form Data:", formData); // Log the form data being sent
    // Send data to backend
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      
      if (res.status === 200) {
        alert("Signup Successful ✅");
        document.querySelector(".signup-form").reset();
      } else {
        alert("Signup Failed ❌: " + data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Signup Failed. Server Error ❌");
    }

  });*/

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
  