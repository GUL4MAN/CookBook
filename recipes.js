import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, arrayUnion, increment, query, orderBy, getDoc} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyArzKcznmBnd2xLGDBmvXJEfJ82a_Zp3vA",
  authDomain: "cookbook-e049e.firebaseapp.com",
  projectId: "cookbook-e049e",
  storageBucket: "cookbook-e049e.firebasestorage.app",
  messagingSenderId: "817038150794",
  appId: "1:817038150794:web:197a446355c8fb4deaf173"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentRecipeId = null;
let allRecipes = [];


async function loadRecipes() {
  const recipeList = document.getElementById("recipe-list");
  recipeList.innerHTML = "<p>Loading recipes...</p>";

  try {
    const q = query(collection(db, "recipes"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      recipeList.innerHTML = "<p>No recipes found.</p>";
      return;
    }

    allRecipes = [];

    querySnapshot.forEach((docSnap) => {
      const recipe = docSnap.data();
      const id = docSnap.id;
      allRecipes.push({ id, ...recipe });
    });

    displayRecipes(allRecipes);
  } catch (err) {
    console.error("Failed to load recipes:", err);
    recipeList.innerHTML = "<p>Error loading recipes.</p>";
  }
}


function displayRecipes(recipes) {
  const recipeList = document.getElementById("recipe-list");
  recipeList.innerHTML = "";

  if (recipes.length === 0) {
    recipeList.innerHTML = "<p>No recipes match your search.</p>";
    return;
  }

  recipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.className = "recipe-card";

    recipeCard.innerHTML = `
      <h3 class="recipe-title">${recipe.title}</h3>
      <img src="${recipe.imageUrl}" alt="${recipe.title}" class="recipe-img" />
    `;

    recipeCard.addEventListener("click", () => {
      showModal(recipe.id);
    });

    recipeList.appendChild(recipeCard);
  });
}


async function showModal(id) {
  currentRecipeId = id;

  const recipeRef = doc(db, "recipes", id);
  const recipeSnap = await getDoc(recipeRef);

  if (!recipeSnap.exists()) {
    alert("Recipe not found");
    return;
  }

  const recipe = recipeSnap.data();

  const modal = document.getElementById("recipe-modal");
  document.getElementById("modal-title").textContent = recipe.title;
  document.getElementById("modal-image").src = recipe.imageUrl;
  document.getElementById("modal-ingredients").innerHTML = recipe.ingredients.replace(/\n/g, "<br>");
  document.getElementById("modal-instructions").innerHTML = recipe.instructions.replace(/\n/g, "<br>");


  const likeCount = document.getElementById("like-count");
  likeCount.textContent = recipe.likes || 0;

  const likeBtn = document.getElementById("like-btn");
  likeBtn.disabled = false;
  likeBtn.onclick = async () => {
    likeBtn.disabled = true; 
    try {
      await updateDoc(recipeRef, {
        likes: increment(1)
      });

      const newLikes = parseInt(likeCount.textContent) + 1;
      likeCount.textContent = newLikes;
    } catch (error) {
      console.error("Failed to update likes:", error);
    } finally {
      likeBtn.disabled = false;
    }
  };


  const commentList = document.getElementById("comment-list");
  commentList.innerHTML = "";
  (recipe.comments || []).forEach((comment) => {
    const li = document.createElement("li");
    li.textContent = comment;
    commentList.appendChild(li);
  });

  const commentInput = document.getElementById("comment-input");
  commentInput.value = "";

  document.getElementById("submit-comment").onclick = async () => {
    const commentText = commentInput.value.trim();
    if (!commentText) return;

    try {
      await updateDoc(recipeRef, {
        comments: arrayUnion(commentText)
      });

      const li = document.createElement("li");
      li.textContent = commentText;
      commentList.appendChild(li);
      commentInput.value = "";
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };


  modal.style.display = "block";
  modal.classList.add("show");
}


document.querySelector(".close-button").addEventListener("click", () => {
  const modal = document.getElementById("recipe-modal");
  modal.style.display = "none";
  modal.classList.remove("show");
});

window.addEventListener("click", (event) => {
  const modal = document.getElementById("recipe-modal");
  if (event.target === modal) {
    modal.style.display = "none";
    modal.classList.remove("show");
  }
});


document.getElementById("search-bar").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase().trim();

  if (!query) {
    displayRecipes(allRecipes);
    return;
  }

  const filtered = allRecipes.filter((recipe) => {
    const titleMatch = recipe.title.toLowerCase().includes(query);
    const ingredientsMatch = recipe.ingredients.toLowerCase().includes(query);
    return titleMatch || ingredientsMatch;
  });

  displayRecipes(filtered);
});

loadRecipes();
