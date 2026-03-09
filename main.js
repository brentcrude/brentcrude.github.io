import * as constants from "./secret.js";
import * as helpers from "./helpers.js";
export let baseCorrect = false;
const BaseButton = document.getElementById("BaseButton");

BaseButton.addEventListener("click", () => {
  const pwdInBase = document.getElementById("BaseCLR");  
  if (helpers.checkPassword(pwdInBase, constants.BASECLRPWD)) {
    alert("Access granted!");
    baseCorrect = true;
  } else {
    alert("Wrong password!");
    baseCorrect = false;
  }
});