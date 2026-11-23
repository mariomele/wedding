const CONTACT_EMAIL = "hello@noor.studio";

// Nav turns solid once the hero leaves the viewport
const nav = document.querySelector(".nav");
new IntersectionObserver(([e]) => nav.classList.toggle("solid", !e.isIntersecting), { rootMargin: "-68px 0px 0px" })
  .observe(document.querySelector(".hero"));

// Reveal sections as they enter
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Stories carousel arrows
const track = document.querySelector(".track");
document.querySelectorAll("[data-dir]").forEach((b) => b.addEventListener("click", () => {
  track.scrollBy({ left: Number(b.dataset.dir) * track.clientWidth * 0.8, behavior: "smooth" });
}));

// Lightbox over every zoomable photo, in page order
const items = [...document.querySelectorAll("[data-full]")];
const lb = document.querySelector(".lb");
const lbImg = lb.querySelector("img");
const lbCap = lb.querySelector(".lb-cap");
let cur = 0;
const show = (i) => {
  cur = (i + items.length) % items.length;
  const el = items[cur];
  const img = el.tagName === "IMG" ? el : el.querySelector("img");
  lbImg.src = el.dataset.full;
  lbImg.alt = img.alt;
  lbCap.textContent = el.dataset.place || "";
};
items.forEach((el, i) => el.addEventListener("click", () => { show(i); lb.showModal(); }));
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
  const body = `Names: ${d.names}\nEmail: ${d.email}\nDate: ${d.date || "-"}\nLocation: ${d.location || "-"}\n\n${d.message}`;
  location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Wedding enquiry, " + d.names)}&body=${encodeURIComponent(body)}`;
});
