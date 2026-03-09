// passwords and content for each level
const passwords = ["sayby", "inner123", "topsecret"];
const secrets = [
  `<h2>Base Secret</h2><p>This is the first level secret.</p>`,
  `<h2>Inner Secret</h2><p>This is the second level secret!</p>`,
  `<h2>Top Secret</h2><p>You’ve reached the final secret!</p>`
];

let currentLevel = 0; // start at base level

window.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("BaseCLR");
  const button = document.getElementById("BaseButton");
  const secretContainer = document.getElementById("secretContainer");

  button.addEventListener("click", () => {
    const pwd = input.value.trim();

    if (pwd === passwords[currentLevel]) {
      alert(`Level ${currentLevel + 1} unlocked!`);

      // show the corresponding secret
      secretContainer.innerHTML = secrets[currentLevel];
      secretContainer.style.display = "block";

      // advance to next level
      currentLevel++;

      // reset input
      input.value = "";

      if (currentLevel >= passwords.length) {
        alert("All secrets unlocked!");
        button.disabled = true; // optional: stop further input
      }

    } else {
      alert("Wrong password!");
    }
  });
});