import * as constants from "./secret.js";
import * as helpers from "./helpers.js";

let baseCorrect = false;

// wait until DOM is fully loaded
window.addEventListener("DOMContentLoaded", () => {
  const BaseButton = document.getElementById("BaseButton");
  const BaseInput = document.getElementById("BaseCLR");

  BaseButton.addEventListener("click", () => {
    const pwdInBase = BaseInput.value.trim(); // trim spaces

    if (helpers.checkPassword(pwdInBase, constants.BASECLRPWD)) {
      alert("Access granted!");
      baseCorrect = true;
    } else {
      alert("Wrong password!");
      baseCorrect = false;
    }

    console.log("Access granted:", baseCorrect);
  });
});