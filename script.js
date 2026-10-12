const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuToggle.innerHTML = isOpen ? 'CLOSE <span aria-hidden="true">×</span>' : 'MENU <span aria-hidden="true">＋</span>';
  });
  navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.innerHTML = 'MENU <span aria-hidden="true">＋</span>';
  }));
}

document.querySelector("#year").textContent = new Date().getFullYear();

// Reveal sections as they enter view; show everything if IntersectionObserver is unavailable.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

// Goals are stored only in this browser. Nothing is sent to a server.
const goalBoxes = [...document.querySelectorAll("[data-goal]")];
const goalCount = document.querySelector("#goal-count");
const goalProgress = document.querySelector("#goal-progress");
const storageKey = "unkn0wn4o3-goals-v1";
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
  goalBoxes.forEach(box => { box.checked = saved.includes(box.dataset.goal); });
} catch (_) { /* Storage may be unavailable; the checklist still works for this visit. */ }

function updateGoals(save = true) {
  const done = goalBoxes.filter(box => box.checked).length;
  goalCount.textContent = `${done} / ${goalBoxes.length} COMPLETE`;
  goalProgress.style.width = `${goalBoxes.length ? done / goalBoxes.length * 100 : 0}%`;
  if (save) {
    try { localStorage.setItem(storageKey, JSON.stringify(goalBoxes.filter(box => box.checked).map(box => box.dataset.goal))); } catch (_) {}
  }
}
goalBoxes.forEach(box => box.addEventListener("change", () => updateGoals()));
updateGoals(false);

// Guard against accidentally leaving template contact links live.
const toast = document.querySelector("#toast");
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
}
document.querySelectorAll("[data-placeholder-link]").forEach(link => {
  link.addEventListener("click", event => {
    if (link.href.includes("example.com")) {
      event.preventDefault();
      showToast("Replace this sample link with your public social profile first.");
    }
  });
});
document.querySelectorAll("[data-placeholder-email]").forEach(link => {
  link.addEventListener("click", event => {
    if (link.href.includes("YOUR_EMAIL@example.com")) {
      event.preventDefault();
      showToast("Add a contact email only if you want to publish one.");
    }
  });
});
