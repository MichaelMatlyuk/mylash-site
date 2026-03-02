// 1) Smooth scroll on pill click (so it "snaps" nicely)
document.querySelectorAll('.pill[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const id = a.getAttribute("href").slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// 2) Lightbox for portfolio
const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbClose = document.getElementById("lbClose");

function openLb(src){
  lbImg.src = src;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
}
function closeLb(){
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lbImg.src = "";
}

gallery?.addEventListener("click", (e) => {
  const btn = e.target.closest(".shot");
  if (!btn) return;
  openLb(btn.dataset.full);
});

lbClose?.addEventListener("click", closeLb);
lightbox?.addEventListener("click", (e) => { if (e.target === lightbox) closeLb(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLb(); });

// 3) Section-change animation + active pill highlight
const panels = [...document.querySelectorAll(".panel[data-section]")];
const pills  = [...document.querySelectorAll(".pill[data-link]")];

function setActive(id){
  pills.forEach(p => p.classList.toggle("is-active", p.dataset.link === id));
  panels.forEach(s => s.classList.toggle("is-active", s.dataset.section === id));
}

const obs = new IntersectionObserver((entries) => {
  const best = entries
    .filter(x => x.isIntersecting)
    .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];

  // reveal animation
  entries.forEach(x => {
    if (x.isIntersecting) x.target.classList.add("is-visible");
  });

  if (!best) return;
  setActive(best.target.dataset.section);
}, { rootMargin: "-35% 0px -55% 0px", threshold: [0.12, 0.25, 0.4] });

panels.forEach(p => obs.observe(p));

const topBar = document.querySelector("header.top");

function setHeaderState() {
  const scrolled = window.scrollY > 40;
  if (topBar) topBar.classList.toggle("is-scrolled", scrolled);
  document.body.classList.toggle("is-scrolled", scrolled);
}

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });