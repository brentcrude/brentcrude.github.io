const passwords = ["sayby", "inner123", "topsecret"];
const secrets = [
  `<h2>Level 1a</h2><p>Welcome ${document.getElementById("username").value.trim()}</p><p>Type 1b Password To Continue</p>`,
  `<h2>Inner Secret</h2><p>Level 2 secret content.</p>`,
  `<h2>Top Secret</h2><p>Top-level unlocked! Enter virtual URL below.</p>`
];

const virtualPages = {
  "/dashboard": "<h3>Dashboard</h3><p>Stats appear here.</p>",
  "/settings": "<h3>Settings</h3><p>Adjust your preferences.</p>",
  "/profile": "<h3>Profile</h3><p>User info.</p>"
};

let currentLevel = 0;

window.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("pwdIn");
  const button = document.getElementById("checkPwd");
  const container = document.getElementById("displayBuffer");

  button.addEventListener("click", () => {
    const pwd = input.value.trim();

    if (pwd === passwords[currentLevel]) {
      alert(`Level ${currentLevel + 1} unlocked!`);

      container.style.display = "block";
      container.innerHTML = "";

      const secretDiv = document.createElement("div");
      secretDiv.classList.add("secret", "show");
      secretDiv.innerHTML = secrets[currentLevel];
      container.appendChild(secretDiv);

      input.value = "";
      currentLevel++;

      if (currentLevel === passwords.length) {
        const urlInput = document.createElement("input");
        urlInput.id = "urlInput";
        urlInput.placeholder = "Enter URL or virtual path (e.g. /dashboard)";
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

        urlButton.addEventListener("click", async () => {
          const raw = urlInput.value.trim();
          if (!raw) return;

          if (raw.startsWith("/")) {
            urlContent.innerHTML =
              virtualPages[raw] || `<p>404: Page not found</p>`;
          } else {
            const fullUrl = raw.startsWith("http") ? raw : "https://" + raw;
            try {
              urlContent.innerHTML = `<p>Loading...</p>`;
              const res = await fetch(fullUrl);
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              const text = await res.text();
              urlContent.innerHTML = text;
            } catch (err) {
              urlContent.innerHTML = `<p>Failed to load: ${err.message}</p>`;
            }
          }
        });
      }

    } else {
      alert("Wrong password!");
    }
  });
});