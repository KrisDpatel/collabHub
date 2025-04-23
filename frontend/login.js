

document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const loginData = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };
  
    console.log("Login Data:", loginData);
  
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
  
      const data = await res.json();
      console.log("Server Response:", data);
  
      if (res.ok) {
        alert("Login Successful ✅");
        localStorage.setItem("username", data.username);
        localStorage.setItem("photo", data.photo); // will be used in nav
        localStorage.setItem("role", data.role); 
        
        // Redirect or store token/session if needed
        // ✅ Save user info to localStorage (if needed)
      // localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Redirect to Events page
      if (data.role === 'student') {
        window.location.href = 'student-dashbord/event_student.html';
      } 
      else if (data.role === 'faculty') {
        window.location.href = 'faculty-dashbord/event_faculty.html';
      }
      

      } else {
        alert("Login Failed ❌ " + data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong 😵‍💫");
    }

  });
  