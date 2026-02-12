// Crear y mostrar la isla
const island = document.createElement("img");
island.id = "island";
island.src = "source/escenario/Isla.png";
island.style.position = "absolute";
island.style.left = "50%";
island.style.top = "50%";
island.style.transform = "translate(-50%, -50%)";
island.style.imageRendering = "pixelated";
island.style.pointerEvents = "none";
world.appendChild(island);
