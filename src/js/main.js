console.log("Hello world!");

document.addEventListener("DOMContentLoaded", () => {
  const personNameEl = document.getElementById("personName");

  if (personNameEl) {
    personNameEl.textContent = "Валерій Валерчикович Валерійчук";
  }

  initToggles();
  renderExperience();
});

function initToggles() {
  const buttons = document.querySelectorAll(".toggle-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const content = document.getElementById(targetId);
      const arrow = btn.querySelector(".arrow");

      if (!content) return;

      content.classList.toggle("hidden");
      arrow.classList.toggle("rotated");
    });
  });
}

const experienceData = [
  {
    company: "Company A",
    role: "Frontend Developer",
    years: "2021 – 2023",
  },
  {
    company: "Company B",
    role: "Web Designer",
    years: "2019 – 2021",
  },
  {
    company: "Company C",
    role: "Intern",
    years: "2018 – 2019",
  },
];

function renderExperience() {
  const list = document.getElementById("experienceList");
  if (!list) return;

  list.innerHTML = "";

  experienceData.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.company} — ${item.role} (${item.years})`;
    list.appendChild(li);
  });
}
