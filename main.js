const CONTACT_EMAIL = "hello@noor.studio";

// Nav turns solid once the hero leaves the viewport
const nav = document.querySelector(".nav");
new IntersectionObserver(([e]) => nav.classList.toggle("solid", !e.isIntersecting), { rootMargin: "-68px 0px 0px" })
  .observe(document.querySelector(".hero"));

// Hero slideshow: slow crossfade, paused for reduced motion
const slides = [...document.querySelectorAll(".hero-img")];
if (slides.length > 1 && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let s = 0;
  setInterval(() => {
    slides[s].classList.remove("on");
    s = (s + 1) % slides.length;
    slides[s].classList.add("on");
  }, 6000);
}

// Reveal text and unveil photos as they enter
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
document.querySelectorAll(".reveal, .clip").forEach((el) => io.observe(el));

// Lightbox over every zoomable photo, in page order
const items = [...document.querySelectorAll("[data-full]")];
const lb = document.querySelector(".lb");
const lbImg = lb.querySelector("img");
const lbCap = lb.querySelector(".lb-cap");
let cur = 0;
const show = (i) => {
  cur = (i + items.length) % items.length;
  const el = items[cur];
  lbImg.src = el.dataset.full;
  lbImg.alt = el.alt;
  lbCap.textContent = el.dataset.place || "";
};
items.forEach((el, i) => {
  const open = () => { show(i); lb.showModal(); };
  el.tabIndex = 0; el.setAttribute("role", "button");
  el.addEventListener("click", open);
  el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
});
lb.querySelector(".close").addEventListener("click", () => lb.close());
lb.querySelector(".prev").addEventListener("click", () => show(cur - 1));
lb.querySelector(".next").addEventListener("click", () => show(cur + 1));
lb.addEventListener("click", (e) => { if (e.target.classList.contains("lb-inner")) lb.close(); });
lb.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") show(cur + 1);
  if (e.key === "ArrowLeft") show(cur - 1);
});

// Contact form: static site, so it composes an email in the visitor's mail app
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  const err = form.querySelector(".error");
  if (!d.names.trim() || !/^\S+@\S+\.\S+$/.test(d.email)) {
    err.textContent = "Please add your names and a valid email.";
    return;
  }
  err.textContent = "";
  const body = `Names: ${d.names}\nEmail: ${d.email}\nDate: ${d.date || "-"}\nLocation: ${d.location || "-"}\nCoverage: ${d.coverage || "-"}\n\n${d.message}`;
  location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Wedding enquiry, " + d.names)}&body=${encodeURIComponent(body)}`;
});
