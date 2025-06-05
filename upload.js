import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

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


const CLOUD_NAME = 'dxhyh4aee';
const UPLOAD_PRESET = 'Cookbook2';


const form = document.getElementById("recipe-form");
const imageInput = document.getElementById("recipe-image");
const imagePreview = document.getElementById("image-preview");
const recipeList = document.getElementById("recipe-list");


imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) {
    imagePreview.src = URL.createObjectURL(file);
    imagePreview.style.display = "block";
  }
});


async function uploadImageToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(url, {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  return data.secure_url;
}


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const ingredients = document.getElementById("ingredients").value.trim();
  const instructions = document.getElementById("instructions").value.trim();
  const imageFile = imageInput.files[0];

  if (!imageFile) {
    alert("Please select an image.");
    return;
  }

  try {
    const imageUrl = await uploadImageToCloudinary(imageFile);

    const docRef = await addDoc(collection(db, "recipes"), {
      title,
      ingredients,
      instructions,
      imageUrl,
      timestamp: new Date()
    });

    alert("Recipe added successfully!");
    form.reset();
    imagePreview.style.display = "none";


    const recipeCard = document.createElement("div");
    recipeCard.innerHTML = `
      <h3>${title}</h3>
      <img src="${imageUrl}" style="max-width:100%; margin: 10px 0;" />
      <p><strong>Ingredients:</strong> ${ingredients}</p>
      <p><strong>Instructions:</strong> ${instructions}</p>
    `;
    recipeList.appendChild(recipeCard);

  } catch (err) {
    console.error("Error adding recipe:", err);
    alert("Failed to upload recipe. Try again.");
  }
});
