// SPECIES comes from species_data.js, which is loaded first.
const grid = document.getElementById("grid");
const detail = document.getElementById("detail");
let filter = "all";

function showGrid() {
  grid.innerHTML = "";
  for (const animal of SPECIES) {
    if (filter !== "all" && animal.light_level !== filter) continue;

    const card = document.createElement("button");
    card.className = "card";
        card.innerHTML = `
      <img src="images/${animal.species_id}.jpg" alt="${animal.common_name}" onerror="this.remove()">
      <span>${animal.common_name}</span>
    `;
    card.onclick = () => selectAnimal(card, animal);
    grid.appendChild(card);
  }
}

function selectAnimal(card, animal) {
  for (const other of document.querySelectorAll(".card")) {
    other.classList.remove("selected");
  }
  card.classList.add("selected");

  const light = animal.light_level === "H" ? "bright light" : "low light";
  detail.innerHTML = `
  <img class="detail-photo" src="images/${animal.species_id}.jpg" alt="${animal.common_name}" onerror="this.remove()">  
  <h2>${animal.common_name}</h2>
    <p class="latin">${animal.latin_name}</p>
    <p>Flicker fusion: <strong>${animal.flicker_fusion_hz} Hz</strong> (human: 60 Hz)</p>
        <div class="blink-row">
      <span class="blink-label">Human</span>
      <span class="dot" style="animation-duration: ${20 / 60}s"></span>
      <span class="blink-label">${animal.common_name}</span>
      <span class="dot" style="animation-duration: ${20 / animal.flicker_fusion_hz}s"></span>
      <span class="blink-note">(shown 20× slower)</span>
    </div>
    <p>Body mass: ${animal.body_mass_g} g</p>
    <p>Lives in: ${light}</p>
  `;
}

for (const button of document.querySelectorAll(".filter")) {
  button.onclick = () => {
    filter = button.dataset.filter;
    for (const other of document.querySelectorAll(".filter")) {
      other.classList.remove("active");
    }
    button.classList.add("active");
    showGrid();
  };
}

showGrid();

// ---------- "How do they see it?" slider ----------

// Short text for each animal (numbers come from data/vision_parameters.csv)
const VISION_INFO = {
  "canis-lupus-familiaris": { name: "Dog", text: "Two kinds of colour cells (blue and yellow), so red and green look alike. About 12 cycles per degree of sharpness; humans have about 60." },
  "felis-catus": { name: "Cat", text: "Two kinds of colour cells, like the dog. About 8 cycles per degree of sharpness." },
  "gallus-gallus-domesticus": { name: "Chicken", text: "Four kinds of colour cells, including ultraviolet, which a screen cannot show. About 7 cycles per degree of sharpness." },
  "macaca-mulatta": { name: "Macaque", text: "Three kinds of colour cells, like us, and sharp vision: about 24 cycles per degree." },
  "pagophilus-groenlandicus": { name: "Harp seal", text: "Only one kind of cone, so no colour. About 5.6 cycles per degree (measured in harbour seals)." },
  "gekko-gecko": { name: "Gecko", text: "Three kinds of colour cells. Sharpness is a stand-in value of 2 cycles per degree, taken from a wall lizard." },
  "spermophilus-lateralis": { name: "Squirrel", text: "Two kinds of colour cells. About 4 cycles per degree of sharpness." },
  "columba-livia": { name: "Pigeon", text: "Four kinds of colour cells, including ultraviolet, which a screen cannot show. About 12.8 cycles per degree." }
};

const visionButtons = document.querySelectorAll("#vision-picker button");
const visionAnimalImg = document.getElementById("vision-animal");
const visionSlider = document.getElementById("vision-slider");
const visionName = document.getElementById("vision-animal-name");
const visionCaption = document.getElementById("vision-caption");

// Show the chosen animal's view and mark its button
function pickVisionAnimal(id) {
  visionAnimalImg.src = `vision/${id}.jpg`;
  visionName.textContent = VISION_INFO[id].name;
  visionCaption.textContent = VISION_INFO[id].text;
  visionButtons.forEach((button) => {
    button.classList.toggle("picked", button.dataset.id === id);
  });
}

// Clicking a picture picks that animal
visionButtons.forEach((button) => {
  button.addEventListener("click", () => pickVisionAnimal(button.dataset.id));
});

// Moving the slider fades the animal's picture in over the human one
visionSlider.addEventListener("input", () => {
  visionAnimalImg.style.opacity = visionSlider.value / 100;
});

// Start with the dog
pickVisionAnimal("canis-lupus-familiaris");

// ---------- Scroll reveal animation ----------
// When an element marked "reveal" scrolls into view, add the class "visible".
// The CSS then fades and slides it in.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);   // play only once
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});