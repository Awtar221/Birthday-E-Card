// Get DOM elements
const card = document.querySelector(".card");
const cardFront = document.querySelector(".card-front");
const updateButton = document.getElementById("update-card");
const downloadButton = document.getElementById("download-card");
const recipientNameInput = document.getElementById("recipient-name");
const messageTextInput = document.getElementById("message-text");
const occasionSelect = document.getElementById("occasion-select");
const insideTitle = document.querySelector(".inside-title");
const message = document.querySelector(".message");
const confettiContainer = document.querySelector(".confetti-container");
const closeButton = document.querySelector(".close-button");
const frontTitle = document.querySelector(".front-title");
const frontSubtitle = document.querySelector(".front-subtitle");

// Occasion configurations
const occasions = {
  birthday: {
    frontTitle: "Happy Birthday!",
    insideTitle: "Wishing You a Happy Birthday!",
    defaultMessage:
      "On your special day, may all your dreams and wishes come true. Enjoy every moment of your celebration!",
    theme: "",
    elements: ".birthday-elements",
  },
  christmas: {
    frontTitle: "Merry Christmas!",
    insideTitle: "Wishing You a Merry Christmas!",
    defaultMessage:
      "May your Christmas be filled with joy, peace, and love. Wishing you and your loved ones a wonderful holiday season!",
    theme: "christmas-theme",
    elements: ".christmas-elements",
  },
  deepavali: {
    frontTitle: "Happy Deepavali!",
    insideTitle: "Wishing You a Happy Deepavali!",
    defaultMessage:
      "May the festival of lights bring joy, prosperity, and happiness to your life. Have a blessed and bright Deepavali!",
    theme: "deepavali-theme",
    elements: ".deepavali-elements",
  },
  cny: {
    frontTitle: "Gong Xi Fa Cai!",
    insideTitle: "Happy Chinese New Year!",
    defaultMessage:
      "Wishing you good fortune, prosperity, and happiness in the new year. May all your wishes come true!",
    theme: "cny-theme",
    elements: ".cny-elements",
  },
  raya: {
    frontTitle: "Selamat Hari Raya!",
    insideTitle: "Wishing You Selamat Hari Raya!",
    defaultMessage:
      "May this special occasion bring peace, happiness, and prosperity to you and your family. Selamat Hari Raya Aidilfitri!",
    theme: "raya-theme",
    elements: ".raya-elements",
  },
};

// Current occasion
let currentOccasion = "birthday";

// Initialize
function initializeCard() {
  updateOccasion(currentOccasion);
}

// Update occasion
function updateOccasion(occasion) {
  currentOccasion = occasion;
  const config = occasions[occasion];

  // Update titles
  frontTitle.textContent = config.frontTitle;
  insideTitle.textContent = config.insideTitle;
  message.textContent = config.defaultMessage;

  // Update theme
  card.className = "card";
  if (config.theme) {
    card.classList.add(config.theme);
  }

  // Show/hide elements
  const allElements = document.querySelectorAll(".occasion-elements");
  allElements.forEach((el) => el.classList.add("hidden"));

  const activeElements = document.querySelector(config.elements);
  if (activeElements) {
    activeElements.classList.remove("hidden");
  }

  // Reset inputs
  recipientNameInput.value = "";
  messageTextInput.value = "";
}

// Occasion change handler
occasionSelect.addEventListener("change", function () {
  updateOccasion(this.value);
});

// Flip card when clicking on front
cardFront.addEventListener("click", function () {
  card.classList.add("open");
  createConfetti();
});

// Close card when clicking close button
closeButton.addEventListener("click", function () {
  card.classList.remove("open");
});

// Update card with custom content
updateButton.addEventListener("click", function () {
  const recipientName = recipientNameInput.value.trim();
  const customMessage = messageTextInput.value.trim();
  const config = occasions[currentOccasion];

  // Update title with recipient name
  if (recipientName) {
    insideTitle.textContent = config.insideTitle.replace(
      "!",
      `, ${recipientName}!`
    );
  } else {
    insideTitle.textContent = config.insideTitle;
  }

  // Update message
  if (customMessage) {
    message.textContent = customMessage;
  } else {
    message.textContent = config.defaultMessage;
  }
});

// Download the currently visible face
downloadButton.addEventListener("click", function () {
  const wasOpen = card.classList.contains("open");
  const target = wasOpen
    ? document.querySelector(".card-inside")
    : document.querySelector(".card-front");

  const rect = target.getBoundingClientRect();
  const clone = target.cloneNode(true);
  clone.classList.add("capture-clone");

  clone.style.position = "fixed";
  clone.style.top = "0";
  clone.style.left = "-9999px";
  clone.style.width = rect.width + "px";
  clone.style.height = rect.height + "px";
  clone.style.transform = "none";
  clone.style.boxShadow = "none";
  clone.style.zIndex = "99999";

  const closeBtn = clone.querySelector(".close-button");
  if (closeBtn) closeBtn.style.display = "none";

  document.body.appendChild(clone);

  setTimeout(() => {
    html2canvas(clone, {
      backgroundColor: "#ffffff",
      scale: 2,
    })
      .then((canvas) => {
        const link = document.createElement("a");
        link.download = `${currentOccasion}-card.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      })
      .catch((err) => {
        console.error("html2canvas error:", err);
        alert("Failed to create image – check console for details.");
      })
      .finally(() => {
        clone.remove();
      });
  }, 50);
});

// Create confetti animation
function createConfetti() {
  confettiContainer.innerHTML = "";

  // Different confetti colors based on occasion
  let colors;
  switch (currentOccasion) {
    case "christmas":
      colors = ["#dc2626", "#10b981", "#fbbf24", "#ffffff", "#3b82f6"];
      break;
    case "deepavali":
      colors = ["#f59e0b", "#dc2626", "#ec4899", "#a855f7", "#fbbf24"];
      break;
    case "cny":
      colors = ["#dc2626", "#fbbf24", "#ef4444", "#f59e0b", "#991b1b"];
      break;
    case "raya":
      colors = ["#10b981", "#fbbf24", "#059669", "#34d399", "#d1fae5"];
      break;
    default:
      colors = ["#ff6b6b", "#48dbfb", "#1dd1a1", "#feca57", "#ff9a9e"];
  }

  const totalConfetti = 50;

  for (let i = 0; i < totalConfetti; i++) {
    const confetti = document.createElement("div");
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 10 + 5;
    const left = Math.random() * 100;

    confetti.style.backgroundColor = color;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.left = `${left}%`;
    confetti.style.top = "-20px";
    confetti.style.position = "absolute";
    confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
    confetti.style.opacity = Math.random() + 0.5;

    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 2;

    confetti.style.animation = `fall ${duration}s ease-in ${delay}s forwards`;
    confettiContainer.appendChild(confetti);
  }
}

// Birthday-specific: Balloon hover effects
document.addEventListener("mouseover", function (e) {
  if (e.target.classList.contains("balloon")) {
    e.target.style.transform = "scale(1.2)";
    e.target.style.transition = "transform 0.3s ease";
  }
});

document.addEventListener("mouseout", function (e) {
  if (e.target.classList.contains("balloon")) {
    e.target.style.transform = "scale(1)";
  }
});

// Birthday-specific: Blow out candle effect
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("flame")) {
    e.stopPropagation();
    e.target.style.opacity = "0";
    e.target.style.transform = "translateX(-50%) scale(0)";
    e.target.style.transition = "all 0.3s ease";

    const wish = document.createElement("div");
    wish.textContent = "Make a wish!";
    wish.style.position = "absolute";
    wish.style.top = "-30px";
    wish.style.left = "50%";
    wish.style.transform = "translateX(-50%)";
    wish.style.color = "#fff";
    wish.style.textShadow = "1px 1px 2px rgba(0,0,0,0.3)";
    wish.style.fontSize = "14px";
    wish.style.fontWeight = "bold";

    const candle = document.querySelector(".candle");
    if (candle) {
      candle.appendChild(wish);

      setTimeout(() => {
        e.target.style.opacity = "1";
        e.target.style.transform = "translateX(-50%) scale(1)";
        if (wish.parentNode) {
          wish.remove();
        }
      }, 3000);
    }
  }
});

// Initialize card on load
initializeCard();
