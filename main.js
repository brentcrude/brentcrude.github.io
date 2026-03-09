// passwords for multi-level secrets
const passwords = ["sayby", "inner123", "topsecret"];
const secrets = [
  `<h2>Base Secret</h2><p>First level secret content</p>`,
  `<h2>Inner Secret</h2><p>Second level secret content</p>`,
  `<h2>Top Secret</h2><p>Top-level secret unlocked!</p>`
];

// virtual URLs for top-level content
const virtualPages = {
  "/dashboard": "<h3>Dashboard Page</h3><p>Stats and charts appear here.</p>",
  "/settings": "<h3>Settings Page</h3><p>Adjust your preferences here.</p>",
  "/profile": "<h3>Profile Page</h3><p>User info and avatar.</p>"
};

let currentLevel = 0;

window.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("BaseCLR");
  const button = document.getElementById("BaseButton");
  const container = document.getElementById("secretContainer");

  button.addEventListener("click", () => {
    const pwd = input.value.trim();

    // clear container for new content
    container.innerHTML = "";

    if (pwd === passwords[currentLevel]) {
      alert(`Level ${currentLevel + 1} unlocked!`);

      // create base secret
      const secretDiv = document.createElement("div");
      secretDiv.classList.add("secret", "show");
      secretDiv.innerHTML = secrets[currentLevel];
      container.appendChild(secretDiv);

      currentLevel++;
      input.value = "";

      // if top-level reached, show "URL input"
      if (currentLevel === passwords.length) {
        const urlInput = document.createElement("input");
        urlInput.id = "urlInput";
        urlInput.placeholder = "Enter virtual URL (e.g., /dashboard)";
        urlInput.style.marginTop = "10px";

        const urlButton = document.createElement("button");
        urlButton.textContent = "Go";
        urlButton.style.marginLeft = "5px";

        const urlContainer = document.createElement("div");
        urlContainer.id = "urlContent";
        urlContainer.style.marginTop = "10px";

        secretDiv.appendChild(urlInput);
        secretDiv.appendChild(urlButton);
        secretDiv.appendChild(urlContainer);

        urlButton.addEventListener("click", () => {
          const url = urlInput.value.trim();
          urlContainer.innerHTML = virtualPages[url] || `<p>404: Page not found</p>`;
        });
      }

    } else {
      alert("Wrong password!");
    }
  });
});