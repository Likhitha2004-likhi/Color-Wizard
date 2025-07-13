let showHex = true;
const formatToggle = document.getElementById("formatToggle");
const generateBtn = document.getElementById("generateBtn");
const colorGrid = document.getElementById("colorGrid");
const favoritesContainer = document.getElementById("favorites");
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// ✅ 1. Random color generator
function getRandomColor() {
  const hex = Math.floor(Math.random() * 0xffffff).toString(16);
  return "#" + hex.padStart(6, "0");
}

// ✅ 2. HEX → RGB converter
function hexToRgb(hex) {
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

// ✅ 3. Main color generator
function generatePalette() {
  colorGrid.innerHTML = "";

  for (let i = 0; i < 12; i++) {
    const hexColor = getRandomColor();
    const rgbColor = hexToRgb(hexColor);
    const displayColor = showHex ? hexColor : rgbColor;

    const colorBox = document.createElement("div");
    colorBox.classList.add("color-box");
    colorBox.style.backgroundColor = hexColor;
    colorBox.innerText = displayColor;

    // 💖 Heart Button
    const heart = document.createElement("span");
    heart.classList.add("heart-btn");
    heart.innerText = "💖";
    heart.title = "Add to Favorites";

    heart.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent triggering the copy
      addToFavorites(hexColor); // always save HEX version
    });

    colorBox.appendChild(heart);

    // ✅ Copy on click (either HEX or RGB depending on toggle)
    colorBox.addEventListener("click", () => {
      navigator.clipboard.writeText(displayColor);
      colorBox.innerText = "Copied!";
      setTimeout(() => {
        colorBox.innerText = displayColor;
        colorBox.appendChild(heart); // re-append heart
      }, 1000);
    });

    colorGrid.appendChild(colorBox);
  }
}


// ✅ 4. Event Listeners
generatePalette();
generateBtn.addEventListener("click", generatePalette);

formatToggle.addEventListener("click", () => {
  showHex = !showHex;
  formatToggle.innerText = showHex ? "🔁 Show RGB" : "🔁 Show HEX";
  generatePalette();
});

const themeToggle = document.getElementById("themeToggle");

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.innerText = "☀️ Light Mode";
  }

  // Load and display saved favorites on page load
  renderFavorites();
});


themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.innerText = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});



function addToFavorites(color) {
  if (!favorites.includes(color)) {
    favorites.push(color);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
  }
}

function renderFavorites() {
  favoritesContainer.innerHTML = "";
  favorites.forEach(color => {
    const favBox = document.createElement("div");
    favBox.classList.add("color-box");
    favBox.style.backgroundColor = color;
    favBox.innerText = color;

    // ❌ Delete Button
    const deleteBtn = document.createElement("span");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerText = "❌";
    deleteBtn.title = "Remove from Favorites";

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent copy
      removeFromFavorites(color);
    });

    favBox.appendChild(deleteBtn);

    // Copy color on click
    favBox.addEventListener("click", () => {
      navigator.clipboard.writeText(color);
      favBox.innerText = "Copied!";
      setTimeout(() => {
        favBox.innerText = color;
        favBox.appendChild(deleteBtn);
      }, 1000);
    });

    favoritesContainer.appendChild(favBox);
  });
}


function removeFromFavorites(color) {
  favorites = favorites.filter(fav => fav !== color);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
}
