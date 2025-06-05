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

  // Firebase imports and config
  import("https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js").then(({ initializeApp }) => {
    import("https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js").then(({ getAuth, onAuthStateChanged, signOut }) => {
      import("https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js").then(({ getFirestore, collection, query, where, getDocs }) => {

        const firebaseConfig = {
          apiKey: "AIzaSyArzKcznmBnd2xLGDBmvXJEfJ82a_Zp3vA",
          authDomain: "cookbook-e049e.firebaseapp.com",
          projectId: "cookbook-e049e",
          storageBucket: "cookbook-e049e.firebasestorage.app",
          messagingSenderId: "817038150794",
          appId: "1:817038150794:web:197a446355c8fb4deaf173"
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);

        const container = document.getElementById("my-recipe-list");
        const emptyMsg = document.getElementById("empty-msg");

        container.style.display = "none";
        emptyMsg.style.display = "block";
        emptyMsg.textContent = "Loading your recipes...";

        function renderRecipes(recipes) {
          emptyMsg.style.display = "none";

          if (!recipes.length) {
            emptyMsg.style.display = "block";
            emptyMsg.textContent = "No recipes found.";
            container.style.display = "none";
            return;
          }

          container.style.display = "grid";
          container.innerHTML = "";

          recipes.forEach(recipe => {
            const card = document.createElement("div");
            card.className = "recipe-card";

            card.innerHTML = `
              <img src="${recipe.image}" alt="${recipe.title}" class="recipe-img" />
              <h3>${recipe.title}</h3>
              <p>${recipe.description || ""}</p>
              <button class="view-btn">View Details</button>
            `;

            card.querySelector(".view-btn").addEventListener("click", () => {
              viewRecipe(recipe.id);
            });

            container.appendChild(card);
          });
        }

        function viewRecipe(id) {
          alert("Open recipe details for recipe ID: " + id);
        }

        async function fetchUserRecipes(userId) {
          try {
            const q = query(collection(db, "recipes"), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);

            const recipes = [];
            querySnapshot.forEach(doc => {
              recipes.push({ id: doc.id, ...doc.data() });
            });

            renderRecipes(recipes);
          } catch (error) {
            emptyMsg.style.display = "block";
            emptyMsg.textContent = "Error loading recipes. Please try again later.";
            container.style.display = "none";
            console.error("Error fetching recipes: ", error);
          }
        }

        onAuthStateChanged(auth, (user) => {
          const logoutButton = document.getElementById('logout');

          if (logoutButton) {
            logoutButton.addEventListener('click', () => {
              localStorage.removeItem('loggedInUserId');
              signOut(auth)
                .then(() => {
                  window.location.href = 'index.html';
                })
                .catch((error) => {
                  console.error('Error Signing out:', error);
                });
            });
          }

          if (user) {
            fetchUserRecipes(user.uid);
          } else {
            emptyMsg.style.display = "block";
            emptyMsg.textContent = "Please log in to see your recipes.";
            container.style.display = "none";
          }
        });

      });
    });
  });
});
