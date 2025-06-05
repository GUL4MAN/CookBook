document.addEventListener("DOMContentLoaded", () => {
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

  // Firebase imports
  import("https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js").then(({ initializeApp }) => {
    import("https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js").then(({ getAuth, onAuthStateChanged, signOut }) => {
      import("https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js").then(({ getFirestore, doc, getDoc, setDoc }) => {

        const firebaseConfig = {
          apiKey: "AIzaSyArzKcznmBnd2xLGDBmvXJEfJ82a_Zp3vA",
          authDomain: "cookbook-e049e.firebaseapp.com",
          projectId: "cookbook-e049e",
          storageBucket: "cookbook-e049e.firebasestorage.app",
          messagingSenderId: "817038150794",
          appId: "1:817038150794:web:197a446355c8fb4deaf173"
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth();
        const db = getFirestore();

        const firstNameSpan = document.getElementById("firstName");
        const lastNameSpan = document.getElementById("lastName");
        const emailSpan = document.getElementById("email");
        const birthdayInput = document.getElementById("birthday");
        const locationInput = document.getElementById("location");
        const phoneInput = document.getElementById("phone");
        const statusMessage = document.getElementById("statusMessage");
        const profileForm = document.getElementById("profileForm");
        const logoutButton = document.getElementById("logout");

        let currentUserId = null;

        onAuthStateChanged(auth, async (user) => {
          if (user) {
            currentUserId = user.uid;
            const userDocRef = doc(db, "users", currentUserId);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              const data = userDocSnap.data();
              firstNameSpan.textContent = data.firstName || "";
              lastNameSpan.textContent = data.lastName || "";
              emailSpan.textContent = data.email || "";
              birthdayInput.value = data.birthday || "";
              locationInput.value = data.location || "";
              phoneInput.value = data.phone || "";
            } else {
              firstNameSpan.textContent = user.displayName ? user.displayName.split(' ')[0] : "";
              lastNameSpan.textContent = user.displayName ? user.displayName.split(' ')[1] || "" : "";
              emailSpan.textContent = user.email || "";
            }
          } else {
            window.location.href = "login.html";
          }
        });

        profileForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          if (!currentUserId) {
            statusMessage.textContent = "You must be logged in to save your profile.";
            statusMessage.style.color = "red";
            return;
          }

          try {
            const userDocRef = doc(db, "users", currentUserId);

            await setDoc(userDocRef, {
              birthday: birthdayInput.value,
              location: locationInput.value.trim(),
              phone: phoneInput.value.trim()
            }, { merge: true });

            statusMessage.textContent = "Profile updated successfully!";
            statusMessage.style.color = "green";
          } catch (error) {
            console.error("Error updating profile:", error);
            statusMessage.textContent = "Failed to update profile.";
            statusMessage.style.color = "red";
          }
        });

        // Logout button logic
        if (logoutButton) {
          logoutButton.addEventListener("click", () => {
            signOut(auth)
              .then(() => {
                localStorage.removeItem("loggedInUserId");
                window.location.href = "index.html";
              })
              .catch((error) => {
                console.error("Error signing out:", error);
              });
          });
        }

      });
    });
  });
});
