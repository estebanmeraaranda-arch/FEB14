const world = document.getElementById("world");

collisions.forEach(col => {
  const cube = document.createElement("div");
  cube.classList.add("collision");

  cube.style.width = col.width + "px";
  cube.style.height = col.height + "px";

  cube.style.left = `calc(50% + ${col.x - col.width / 2}px)`;
  cube.style.top  = `calc(50% + ${col.y - col.height / 2}px)`;

  world.appendChild(cube);
});

