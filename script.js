(() => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector("#nav-menu");
  const header = document.querySelector(".site-header");
  const toTop = document.querySelector(".to-top");
  const toast = document.querySelector(".toast");

  const closeMenu = () => {
    if (!menuToggle || !navMenu) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
  };

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      navMenu.classList.toggle("open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });
    navMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 680) closeMenu();
    });
  }

  const updateScrollUI = () => {
    const y = window.scrollY || 0;
    header?.classList.toggle("scrolled", y > 12);
    toTop?.classList.toggle("visible", y > 550);
  };
  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();
  toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  const time = document.querySelector("#local-time");
  const updateTime = () => {
    if (!time) return;
    const formatted = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(new Date());
    time.textContent = `LOCAL TIME — ${formatted}`;
  };
  updateTime();
  setInterval(updateTime, 60_000);

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
      observer.observe(item);
    });
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  const placeholderLinks = document.querySelectorAll("[data-placeholder-link]");
  placeholderLinks.forEach(link => link.addEventListener("click", event => {
    event.preventDefault();
    if (!toast) return;
    toast.textContent = "Add your real profile URL in index.html first.";
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2600);
  }));
})();
