const root = document.getElementById("root");
if (root) {
  root.innerHTML = "";
  const container = document.createElement("div");
  container.id = "spaghetti-plano-loaded";
  container.textContent = "SpaghettiPlano loaded";
  root.appendChild(container);
}
