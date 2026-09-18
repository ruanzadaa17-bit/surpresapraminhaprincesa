const ui = document.getElementById("ui");
const totalItems = 100;

/* =========================
   CORAÇÃO
   ========================= */

for (let i = 1; i <= totalItems; i++) {
  const love = document.createElement("div");
  love.className = "love";
  love.style.setProperty("--i", i);

  love.innerHTML = `
    <div class="love_horizontal">
      <div class="love_vertical">
        <div class="love_word">Duda</div>
      </div>
    </div>
  `;

  ui.appendChild(love);
}

function fitHeart() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  const horizontalSpace = w * (w < 600 ? 0.88 : 0.72);
  const verticalSpace = h * (w < 600 ? 0.68 : 0.76);

  const scale = Math.min(
    horizontalSpace / 450,
    verticalSpace / 450,
    1.25
  );

  ui.style.setProperty("--scale", scale.toFixed(4));
}

fitHeart();
window.addEventListener("resize", fitHeart, { passive: true });
window.addEventListener("orientationchange", fitHeart, { passive: true });

/* =========================
   CADEADO
   senha: 14 • 12 • 25
   ========================= */

const PASSWORD = ["14", "12", "25"];

const inputs = [
  document.getElementById("day"),
  document.getElementById("month"),
  document.getElementById("year")
];

const button = document.getElementById("unlockButton");
const card = document.getElementById("lockCard");
const error = document.getElementById("errorMessage");

function digitsOnly(value) {
  return value.replace(/\D/g, "").slice(0, 2);
}

inputs.forEach((input, index) => {
  input.addEventListener("input", (event) => {
    input.value = digitsOnly(input.value);
    hideError();

    if (input.value.length === 2 && index < inputs.length - 1) {
      inputs[index + 1].focus();
      inputs[index + 1].select();
    }

    if (inputs.every((item) => item.value.length === 2)) {
      tryUnlock();
    }
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Backspace" && input.value.length === 0 && index > 0) {
      inputs[index - 1].focus();
    }

    if (event.key === "Enter") {
      tryUnlock();
    }
  });

  input.addEventListener("paste", (event) => {
    const pasted = (event.clipboardData || window.clipboardData)
      .getData("text")
      .replace(/\D/g, "");

    if (pasted.length >= 6) {
      event.preventDefault();

      inputs[0].value = pasted.slice(0, 2);
      inputs[1].value = pasted.slice(2, 4);
      inputs[2].value = pasted.slice(4, 6);

      tryUnlock();
    }
  });
});

button.addEventListener("click", tryUnlock);

function tryUnlock() {
  const typed = inputs.map((input) => input.value);

  if (typed.join("|") === PASSWORD.join("|")) {
    unlock();
    return;
  }

  if (inputs.some((input) => input.value.length < 2)) {
    showError("Complete a data primeiro");
    return;
  }

  wrongPassword();
}

function unlock() {
  inputs.forEach((input) => input.blur());
  button.disabled = true;
  hideError();

  document.body.classList.remove("locked");
  document.body.classList.add("unlocked");
}

function wrongPassword() {
  showError("Essa não é a nossa data 💗");

  card.classList.remove("wrong");
  void card.offsetWidth;
  card.classList.add("wrong");

  setTimeout(() => {
    inputs.forEach((input) => (input.value = ""));
    inputs[0].focus();
  }, 320);
}

function showError(message) {
  error.textContent = message;
  error.classList.add("show");
}

function hideError() {
  error.classList.remove("show");
}

setTimeout(() => inputs[0].focus(), 350);
