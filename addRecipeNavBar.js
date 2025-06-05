const profileToggle = document.getElementById("profile-toggle");
    const profileDropdown = document.getElementById("profile-dropdown");

    profileToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!profileDropdown.contains(e.target) && e.target !== profileToggle) {
        profileDropdown.classList.remove("show");
      }
    });

document.getElementById('recipe-image').addEventListener('change', function () {
  const file = this.files[0];
  const preview = document.getElementById('image-preview');

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    preview.style.display = 'none';
  }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {getAuth, signOut} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import{getFirestore,} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyArzKcznmBnd2xLGDBmvXJEfJ82a_Zp3vA",
    authDomain: "cookbook-e049e.firebaseapp.com",
    projectId: "cookbook-e049e",
    storageBucket: "cookbook-e049e.firebasestorage.app",
    messagingSenderId: "817038150794",
    appId: "1:817038150794:web:197a446355c8fb4deaf173"
  };
 

  const app = initializeApp(firebaseConfig);
  const auth=getAuth();
  const db=getFirestore();

  const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('loggedInUserId');
  signOut(auth)
    .then(() => {
      window.location.href = 'index.html';
    })
    .catch((error) => {
      console.error('Error signing out:', error);
    });
});