document.addEventListener('DOMContentLoaded', function () {
const fileInput = document.getElementById('photo-upload');
    const previewImg = document.getElementById('preview-img');
  
    fileInput.addEventListener('change', function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          previewImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  });

  function handleNavigation(section) {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
  
    if (!isLoggedIn) {
      alert("Please login first to view events.");
      window.location.href = "login.html";
      return;
    }
  
    if (section === 'events') {
      window.location.href = "event.html"; // replace with your actual events page
    }
  }
  

  
  