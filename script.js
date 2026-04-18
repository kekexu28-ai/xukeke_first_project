const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
const revealNodes = Array.from(document.querySelectorAll('.reveal'));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function setActiveLink(activeId) {
  for (const link of navLinks) {
    const isActive = link.getAttribute('href') === `#${activeId}`;
    link.classList.toggle('is-active', isActive);
  }
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    }
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -10% 0px"
  }
);

for (const node of revealNodes) {
  revealObserver.observe(node);
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visibleSection) {
      setActiveLink(visibleSection.target.id);
    }
  },
  {
    threshold: [0.2, 0.45, 0.7],
    rootMargin: "-18% 0px -55% 0px"
  }
);

for (const section of sections) {
  sectionObserver.observe(section);
}

setActiveLink("hero");

for (const link of navLinks) {
  link.addEventListener("click", () => {
    const targetId = link.getAttribute("href").slice(1);
    setActiveLink(targetId);
  });
}

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  for (const node of revealNodes) {
    node.classList.add("is-visible");
  }
}
