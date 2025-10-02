// Get DOM elements
const card = document.querySelector(".card");
const cardFront = document.querySelector(".card-front");
const updateButton = document.getElementById("update-card");
const downloadButton = document.getElementById("download-card");
const recipientNameInput = document.getElementById("recipient-name");
const messageTextInput = document.getElementById("message-text");
const colorThemeSelect = document.getElementById("color-theme");
const insideTitle = document.querySelector(".inside-title");
const message = document.querySelector(".message");
const confettiContainer = document.querySelector(".confetti-container");
const closeButton = document.querySelector(".close-button");
const flame = document.querySelector(".flame");

// Flip card when clicking on front
cardFront.addEventListener("click", function () {
  card.classList.add("open");
  createConfetti();
});

// Close card when clicking close button
closeButton.addEventListener("click", function () {
  card.classList.remove("open");
});

// Update card with custom content (improved)
updateButton.addEventListener("click", function () {
  const recipientName = recipientNameInput.value.trim();
  const customMessage = messageTextInput.value.trim();
  const selectedTheme = colorThemeSelect.value;

  // Recipient/title
  if (recipientName) {
    insideTitle.textContent = `Wishing You a Happy Birthday, ${recipientName}!`;
  } else {
    insideTitle.textContent = "Wishing You a Happy Birthday!";
  }

  // Message
  if (customMessage) {
    message.textContent = customMessage;
  } else {
    message.textContent =
      "On your special day, may all your dreams and wishes come true. Enjoy every moment of your celebration!";
  }

  // Theme handling — remove previous theme classes cleanly
  card.classList.remove("blue-theme", "green-theme", "pink-theme");
  if (selectedTheme !== "default") {
    card.classList.add(`${selectedTheme}-theme`);
  }
});

// Download the currently visible face (front if closed, inside if open)
downloadButton.addEventListener("click", function () {
  const wasOpen = card.classList.contains("open");
  // capture whichever face is currently shown
  const target = wasOpen
    ? document.querySelector(".card-inside")
    : document.querySelector(".card-front");

  // compute size so clone matches
  const rect = target.getBoundingClientRect();

  // clone the target face so we can force-transform:none without touching the real DOM state
  const clone = target.cloneNode(true);
  clone.classList.add("capture-clone");

  // place off-screen (so user doesn't see a flash) but still in DOM so html2canvas can render it
  clone.style.position = "fixed";
  clone.style.top = "0";
  clone.style.left = "-9999px";
  clone.style.width = rect.width + "px";
  clone.style.height = rect.height + "px";
  clone.style.transform = "none"; // IMPORTANT: override any rotateY flip
  clone.style.boxShadow = "none";
  clone.style.zIndex = "99999";

  // hide UI elements we don't want in the exported image
  const closeBtn = clone.querySelector(".close-button");
  if (closeBtn) closeBtn.style.display = "none";

  document.body.appendChild(clone);

  // tiny delay to let the browser apply styles (50ms)
  setTimeout(() => {
    html2canvas(clone, {
      backgroundColor: "#ffffff",
      scale: 2,
    })
      .then((canvas) => {
        const link = document.createElement("a");
        link.download = "birthday-card.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      })
      .catch((err) => {
        console.error("html2canvas error:", err);
        alert("Failed to create image — check console for details.");
      })
      .finally(() => {
        // clean-up
        clone.remove();
      });
  }, 50);
});

// Create confetti animation
function createConfetti() {
  confettiContainer.innerHTML = "";
  const colors = ["#ff6b6b", "#48dbfb", "#1dd1a1", "#feca57", "#ff9a9e"];
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

// Balloon hover effects
const balloons = document.querySelectorAll(".balloon");
balloons.forEach((balloon) => {
  balloon.addEventListener("mouseover", function () {
    this.style.transform = "scale(1.2)";
    this.style.transition = "transform 0.3s ease";
  });

  balloon.addEventListener("mouseout", function () {
    this.style.transform = "scale(1)";
  });
});

// Blow out candle effect
flame.addEventListener("click", function (e) {
  e.stopPropagation();
  this.style.opacity = "0";
  this.style.transform = "translateX(-50%) scale(0)";
  this.style.transition = "all 0.3s ease";

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
  candle.appendChild(wish);

  // Relight the candle after 3 seconds
  setTimeout(() => {
    this.style.opacity = "1";
    this.style.transform = "translateX(-50%) scale(1)";
    if (wish.parentNode) {
      wish.remove();
    }
  }, 3000);
});
