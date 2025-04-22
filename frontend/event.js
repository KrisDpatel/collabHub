  function showTab(id) {
    const contents = document.querySelectorAll('.tab-content');
    const tabs = document.querySelectorAll('.tab-btn');
  
    // Hide all content and remove active class from all tabs
    contents.forEach(content => content.style.display = 'none');
    tabs.forEach(tab => tab.classList.remove('active'));
  
    // Show the selected section
    const selectedSection = document.getElementById(id);
    if (selectedSection) {
      selectedSection.style.display = 'block';
    }
  
    // Add 'active' class to the button that triggered this function
    // Fix for event.target issue: use id to find the matching tab
    tabs.forEach(tab => {
      if (tab.getAttribute('onclick')?.includes(id)) {
        tab.classList.add('active');
      }
    });
  }
  
  // On page load
  document.addEventListener("DOMContentLoaded", () => {
    // Show default section
    showTab('eventSection');
  
    // Load username if exists
    const username = localStorage.getItem("username");
  const photo = localStorage.getItem("photo");

  if (username) {
    document.getElementById("username-display").textContent = username;
  }

  if (photo) {
    document.querySelector(".profile-pic").src = `http://localhost:5000/uploads/${photo}`;
  }
  
    // Logout logic
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "login.html";
    });
  });
  