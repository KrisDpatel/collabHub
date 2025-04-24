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

  
   // featch collabs
   async function fetchCollabs() {
    try {
      const response = await fetch('http://localhost:5000/api/collab/get-collab');
      const collabs = await response.json();

      const container = document.getElementById('collabSection');
      container.innerHTML = " ";

      collabs.forEach(collab => {
        const card = document.createElement('div');
        card.className = 'event-card';

        card.innerHTML = `
          <img src="http://localhost:5000/uploads/${collab.photo}" alt="Event Image" />
          <h3>${collab.title}</h3>
          <p>${collab.description}</p>
          <p><strong>Date:</strong> ${new Date(collab.date).toLocaleDateString()}</p>
        `;

        container.appendChild(card);
      });

    } catch (error) {
      console.error('Error fetching events:', error);
    }
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
    card.className = "event-card";
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

  // Call on page load
  document.addEventListener('DOMContentLoaded', ()=>{fetchEvents(),fetchCollabs(),loadQuestions()});
  