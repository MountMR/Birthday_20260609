const PASSWORD = "7305";
const MUSIC_FILE = "music/RaziyaOfficial%20-%20Happy%20Birthday%20To%20You%20(%E5%B0%8F%E9%BB%84%E4%BA%BA%E7%89%88)_L%20(V0).mp3";

const lockScreen = document.getElementById("lockScreen");
const book = document.getElementById("book");
const form = document.getElementById("passwordForm");
const input = document.getElementById("passwordInput");
const error = document.getElementById("passwordError");
const music = document.getElementById("birthdayMusic");
const musicBtn = document.getElementById("musicBtn");
const restartBtn = document.getElementById("restartBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const partyBtn = document.getElementById("partyBtn");
const pageDots = document.getElementById("pageDots");
const pages = Array.from(document.querySelectorAll(".page"));

let currentPage = 0;
let touchStartX = 0;
let partyStarted = false;

music.src = MUSIC_FILE;

pages.forEach((_, index) => {
  const dot = document.createElement("span");
  dot.setAttribute("aria-label", `第${index + 1}页`);
  pageDots.appendChild(dot);
});

const dots = Array.from(pageDots.children);

function setPage(index) {
  const nextIndex = Math.max(0, Math.min(index, pages.length - 1));
  const direction = nextIndex >= currentPage ? "forward" : "backward";

  pages.forEach((page, pageIndex) => {
    page.classList.remove("active", "exit-forward", "exit-backward", "forward", "backward");
    if (pageIndex === nextIndex) {
      page.classList.add("active", direction);
    } else if (pageIndex === currentPage) {
      page.classList.add(direction === "forward" ? "exit-forward" : "exit-backward");
    }
  });

  dots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === nextIndex));
  currentPage = nextIndex;
}

function startExperience() {
  lockScreen.classList.add("is-hidden");
  book.classList.remove("is-hidden");
  setPage(0);
  playMusic();
}

function playMusic() {
  music.play()
    .then(() => {
      musicBtn.textContent = "暂停音乐";
    })
    .catch(() => {
      musicBtn.textContent = "播放音乐";
    });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (input.value.trim() === PASSWORD) {
    error.textContent = "";
    startExperience();
    return;
  }
  error.textContent = "再想想哦，小黄人正在帮你数日子！";
  input.select();
});

partyBtn.addEventListener("click", () => {
  if (partyStarted) {
    return;
  }
  partyStarted = true;
  pages[1].classList.add("party-started");
  partyBtn.setAttribute("aria-label", "香蕉已经散落，蜡烛已经点亮");
});

prevBtn.addEventListener("click", () => setPage(currentPage - 1));
nextBtn.addEventListener("click", () => setPage(currentPage + 1));

restartBtn.addEventListener("click", () => {
  pages[1].classList.remove("party-started");
  partyStarted = false;
  setPage(0);
});

musicBtn.addEventListener("click", () => {
  if (music.paused) {
    playMusic();
  } else {
    music.pause();
    musicBtn.textContent = "播放音乐";
  }
});

document.addEventListener("keydown", (event) => {
  if (book.classList.contains("is-hidden")) {
    return;
  }
  if (event.key === "ArrowRight" || event.key === " ") {
    setPage(currentPage + 1);
  }
  if (event.key === "ArrowLeft") {
    setPage(currentPage - 1);
  }
});

book.addEventListener("touchstart", (event) => {
  touchStartX = event.touches[0].clientX;
}, { passive: true });

book.addEventListener("touchend", (event) => {
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) < 45) {
    return;
  }
  setPage(currentPage + (distance < 0 ? 1 : -1));
}, { passive: true });

setPage(0);
