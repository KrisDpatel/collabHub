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
    document.querySelector("#profile-pic").src = `http://localhost:5000/uploads/${photo}`;
  }
  
    // Logout logic
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "../login.html";
    });
  });

  // dropdwon settings
  const userInfo = document.getElementById('userInfo');
  const dropdownMenu = document.getElementById('dropdownMenu');

  userInfo.addEventListener("click", () => {
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
  });

  // Optional: close dropdown if clicked outside
  window.addEventListener('click', function(e) {
    if (!userInfo.contains(e.target)) {
      dropdownMenu.style.display = 'none';
    }
  });

  // featch events
  async function fetchEvents() {
    try {
      const response = await fetch('http://localhost:5000/api/event/get-events');
      const events = await response.json();

      const container = document.getElementById('eventSection');
      container.innerHTML = " ";

      events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';

        card.innerHTML = `
          <img src="http://localhost:5000/uploads/${event.photo}" alt="Event Image" />
          <h3>${event.title}</h3>
          <p>${event.description}</p>
          <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
        `;

        container.appendChild(card);
      });

    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }

  // Call on page load
  document.addEventListener('DOMContentLoaded', fetchEvents);
  