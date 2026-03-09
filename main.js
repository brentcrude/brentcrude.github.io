// main.js
const passwords = ["sayby", "inner123", "topsecret"];
const secrets = [
  `<h2>Base Secret</h2><p>This is level 1 secret.</p>`,
  `<h2>Inner Secret</h2><p>This is level 2 secret.</p>`,
  `<h2>Top Secret</h2><p>Top-level secret unlocked! Enter virtual URL below.</p>`
];

const virtualPages = {
  "/dashboard": "<h3>Dashboard</h3><p>Stats appear here.</p>",
  "/settings": "<h3>Settings</h3><p>Adjust your preferences.</p>",
  "/profile": "<h3>Profile</h3><p>User info.</p>"
};

let currentLevel = 0;

window.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("BaseCLR");
  const button = document.getElementById("BaseButton");
  const container = document.getElementById("secretContainer");

  button.addEventListener("click", () => {
    const pwd = input.value.trim();
    container.innerHTML = ""; // clear previous content

    if (pwd === passwords[currentLevel]) {
      alert(`Level ${currentLevel + 1} unlocked!`);

      const secretDiv = document.createElement("div");
      secretDiv.classList.add("secret", "show");
      secretDiv.innerHTML = secrets[currentLevel];
      container.appendChild(secretDiv);

      currentLevel++;
      input.value = "";

      // if top-level, add URL input and button dynamically
      if (currentLevel === passwords.length) {
        const urlInput = document.createElement("input");
        urlInput.id = "urlInput";
        urlInput.placeholder = "Enter virtual URL (e.g., /dashboard)";
        urlInput.style.marginTop = "10px";

        const urlButton = document.createElement("button");
        urlButton.textContent = "Go";
        urlButton.style.marginLeft = "5px";

        const urlContent = document.createElement("div");
        urlContent.id = "urlContent";
        urlContent.style.marginTop = "10px";

        secretDiv.appendChild(urlInput);
        secretDiv.appendChild(urlButton);
        secretDiv.appendChild(urlContent);

        // attach listener **after creating the elements**
        urlButton.addEventListener("click", () => {
          const virtualUrl = urlInput.value.trim();
          urlContent.innerHTML =
            virtualPages[virtualUrl] || `<p>404: Page not found</p>`;
        });
      }
    } else {
      alert("Wrong password!");
    }
  });
});