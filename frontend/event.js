// const userId = localStorage.getItem("userId");

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

/*
  async function fetchEvents() {
    try {
      const response = await fetch('http://localhost:5000/api/event/get-events');
      const events = await response.json();
  
      const now = new Date();
      const upcomingContainer = document.getElementById('upcomingEvents');
      const pastContainer = document.getElementById('pastEvents');
      upcomingContainer.innerHTML = "";
      pastContainer.innerHTML = "";
  
      events.forEach(event => {
        const eventDate = new Date(event.date);
        const eventTime = event.time;
        const timeRemaining = eventDate - now;
  
        let countdownStr = "";
        if (timeRemaining > 0) {
          const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
          const seconds = Math.floor((timeRemaining / 1000) % 60);
          countdownStr = `${days}d ${hours}h ${minutes}m ${seconds}s remaining`;
        }
  
        const card = document.createElement('div');
        card.className = 'event-card';
  
        card.innerHTML = `
          <div class="event-inner-vertical">
            <img class="event-photo" src="http://localhost:5000/uploads/${event.photo}" alt="Event Image" />
            <div class="event-content">
              <h3 class="event-title">${event.title}</h3>
              <p class="event-desc">${event.description}</p>
              <p><strong>Date:</strong> ${eventDate.toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${eventTime}</p>
              ${timeRemaining > 0 
                ? `<p class="countdown">${countdownStr}</p>` 
                : `<p class="countdown" style="color: red;">Event Ended</p>`}
            </div>
            <button class="register-btn">Register Now</button>
          </div>
        `;
  
        if (timeRemaining > 0) {
          upcomingContainer.appendChild(card);
        } else {
          pastContainer.appendChild(card);
        }
      });
  
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }
    */

  async function fetchEvents() {
  try {
    const response = await fetch('http://localhost:5000/api/event/get-events');
    const events = await response.json();

    const now = new Date();
    const upcomingContainer = document.getElementById('upcomingEvents');
    const pastContainer = document.getElementById('pastEvents');
    upcomingContainer.innerHTML = "";
    pastContainer.innerHTML = "";

    events.forEach(event => {
      // Combine date and time into one full datetime string
      const eventDateTimeStr = `${event.date}T${event.time}`; // e.g., "2025-05-10T18:00:00"
      const eventDateTime = new Date(eventDateTimeStr);

      // Registration closes 24 hours before the event
      const registrationCloseTime = new Date(eventDateTime.getTime() - 24 * 60 * 60 * 1000);
      const isUpcoming = eventDateTime > now;

      const card = document.createElement('div');
      card.className = 'event-card';

      card.innerHTML = `
        <div class="event-inner-vertical">
          <img class="event-photo" src="http://localhost:5000/uploads/${event.photo}" alt="Event Image" />
          <div class="event-content">
            <h3 class="event-title">${event.title}</h3>
            <p class="event-desc">${event.description}</p>
            <p><strong>Date:</strong> ${eventDateTime.toLocaleString()}</p>
            <p class="countdown" data-date="${eventDateTimeStr}" data-close="${registrationCloseTime.toISOString()}"></p>
          </div>
          <button class="register-btn ${now >= registrationCloseTime ? 'disabled' : ''}" ${now >= registrationCloseTime ? 'disabled' : ''} >
            ${now >= registrationCloseTime ? 'Registration Closed' : 'Register Now'}
          </button>
        </div>
      `;

      if (isUpcoming) {
        upcomingContainer.appendChild(card);
      } else {
        pastContainer.appendChild(card);
      }
    });

    startLiveCountdowns();
  } catch (error) {
    console.error('Error fetching events:', error);
  }
}

function startLiveCountdowns() {
  setInterval(() => {
    const countdowns = document.querySelectorAll('.countdown[data-date]');
    const now = new Date();

    countdowns.forEach(el => {
      const eventTime = new Date(el.getAttribute('data-date'));
      const closeTime = new Date(el.getAttribute('data-close'));
      const diff = eventTime - now;
      const closeDiff = closeTime - now;

      if (diff <= 0) {
        el.textContent = 'Event Ended';
        el.style.color = 'red';
      } else if (closeDiff <= 0) {
        el.textContent = 'Registration Closed';
        el.style.color = 'gray';
      } else {
        const days = Math.floor(closeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((closeDiff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((closeDiff / (1000 * 60)) % 60);
        const seconds = Math.floor((closeDiff / 1000) % 60);
        el.textContent = `Registration ends in ${days}d ${hours}h ${minutes}m ${seconds}s`;
        el.style.color = '#e67e22';
      }
    });
  }, 1000);
}

  
  

  
   // featch collabs
   async function fetchCollabs() {
    try {
      const response = await fetch('http://localhost:5000/api/collab/get-collab');
      const collabs = await response.json();
  
      const now2 = new Date();
      const upcomingContainer2 = document.getElementById('upcomingCollabs');
      const pastContainer2 = document.getElementById('pastCollabs');
  
      upcomingContainer2.innerHTML = "";
      pastContainer2.innerHTML = "";
  
      collabs.forEach(collab => {
        const collabDateTimeStr = `${collab.date}T${collab.time}`; // e.g., "2025-05-10T18:00:00"
        const collabDateTime = new Date(collabDateTimeStr);
        // const collabDateTime = new Date(`${collab.date}T${collab.time}`);
        const isUpcoming2 = now2 < collabDateTime;
        const isRegistrationOpen2 = now2 < collabDateTime;
  
        const card = document.createElement('div');
        card.className = 'event-card';
  
        card.innerHTML = `
          <div class="event-inner-vertical">
            <img class="event-photo" src="http://localhost:5000/uploads/${collab.photo}" alt="Collab Image" />
            <div class="event-content">
              <h3 class="event-title">${collab.title}</h3>
              <p class="event-desc">${collab.description}</p>
              <p><strong>Date:</strong> ${collabDateTime.toLocaleString()}</p>
              <p class="countdown" data-date2="${collabDateTimeStr}" style="color: ${isUpcoming2 ? 'green' : 'red'}">
                ${isUpcoming2 ? '' : 'Collab Passed'}
              </p>
            </div>
            <button class="register-btn ${!isRegistrationOpen2 ? 'disabled' : ''}" ${!isRegistrationOpen2 ? 'disabled' : ''}>
              Register Now
            </button>
          </div>
        `;
  
        if (isUpcoming2) {
          upcomingContainer2.appendChild(card);
        } else {
          pastContainer2.appendChild(card);
        }
      });
  
      startLiveCollabCountdowns();
  
    } catch (error) {
      console.error('Error fetching collabs:', error);
    }
  }
  

  function startLiveCollabCountdowns() {
    setInterval(() => {
      const countdowns = document.querySelectorAll('.countdown[data-date2]');
      const now2 = new Date();
  
      countdowns.forEach(el => {
        const targetDate = new Date(el.getAttribute('data-date2'));
        const diff = targetDate - now2;
  
        const button = el.closest('.event-inner-vertical').querySelector('.register-btn');
  
        if (diff <= 0) {
          el.textContent = 'Registration closed';
          el.style.color = 'red';
          if (button) {
            button.classList.add('disabled');
            button.setAttribute('disabled', true);
          }
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          const seconds = Math.floor((diff / 1000) % 60);
          el.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s remaining`;
        }
      });
    }, 1000);
  }
  
  
  


  const postQuestionBtn = document.getElementById("postQuestionBtn");
const questionFormContainer = document.getElementById("questionFormContainer");

// Toggle display on button click
postQuestionBtn.addEventListener("click", () => {
  const isVisible = questionFormContainer.style.display === "block";
  questionFormContainer.style.display = isVisible ? "none" : "block";
});

// Close if clicked outside
window.addEventListener("click", function (e) {
  if (!questionFormContainer.contains(e.target) && e.target !== postQuestionBtn) {
    questionFormContainer.style.display = "none";
  }
});

// console.log(localStorage.getItem("username"));
// console.log(localStorage.getItem("role"));
// console.log(localStorage.getItem("photo"));
// console.log(localStorage.getItem("userId"));


  // Q&A session

 // Q&A session
const username = localStorage.getItem("username");
const userRole = localStorage.getItem("userRole"); // 'faculty' or 'student'
const userId = localStorage.getItem("userId");

document.getElementById("questionForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const content = document.getElementById("questionText").value;

  const res = await fetch("http://localhost:5000/api/qna/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, userId})
  });

  if (res.ok) {
    document.getElementById("questionText").value = "";
    loadQuestions();
  }
});

async function loadQuestions() {
  const res = await fetch("http://localhost:5000/api/qna/questions");
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const questions = await res.json();
  const list = document.getElementById("questionsList");
  list.innerHTML = "";

  for (const q of questions) {
    const card = document.createElement("div");
    card.className = "issue-card";
    const isFaculty = q.postedBy.role === "faculty";
    card.innerHTML = `
      <p><strong>${q.postedBy.username}${isFaculty ? ' (F)' : ''}</strong>: ${q.content}</p>
      <form class="answer-form" data-id="${q._id}">
        <textarea placeholder="Write your answer..." required></textarea>
        <button type="submit">Answer</button>
      </form>
      <div class="answers" id="answers-${q._id}"></div>
    `;

    list.appendChild(card);

    // Load existing answers
    loadAnswers(q._id);

    // Answer form submission
    card.querySelector(".answer-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const content = e.target.querySelector("textarea").value;

      await fetch(`http://localhost:5000/api/qna/questions/${q._id}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, userId })
      });

      e.target.querySelector("textarea").value = "";
      loadAnswers(q._id);
    });
  }
}

async function loadAnswers(questionId) {
  const res = await fetch(`http://localhost:5000/api/qna/questions/${questionId}`);
  const { answers } = await res.json();
  const container = document.getElementById(`answers-${questionId}`);
  container.innerHTML = "";

  for (const a of answers) {
    const div = document.createElement("div");
    const isFaculty = a.postedBy.role === "faculty";
    div.className = "answer-card";
    div.innerHTML = `<p><strong>${a.postedBy.username}${isFaculty ? ' (F)' : ''}</strong>: ${a.content}</p>`;
    container.appendChild(div);
  }
}

const registerBtn = card.querySelector('.register-btn');

  if (!registrationClosed) {
  registerBtn.addEventListener('click', () => {
    // Change this URL to your desired registration page
    window.location.href = `../registration.html`;
  });
  }

  // Call on page load
  document.addEventListener('DOMContentLoaded', ()=>{fetchEvents(),fetchCollabs(),loadQuestions()});
  