let timesEscapePressed = 0;
let clockOn = false;
// This probably isn't the best way to get this done, but here's my idea
document.addEventListener("keyup", function (e) {
  if (e.code == "Escape") {
    timesEscapePressed++;
  }
  if (timesEscapePressed >= 3) {
    timesEscapePressed = 0;
    // cloak
    if (!clockOn) {
      let iframe = document.createElement("iframe");
      iframe.src = "/clock/index.html";
      iframe.classList.add("clock-frame");
      iframe.style.position = "fixed";
      iframe.style.top = "0";
      iframe.style.left = "0";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.zIndex = "2147483647";
      document.body.appendChild(iframe);
      clockOn = true;
    } else {
      clockOn = false;
      document.querySelector(".clock-frame").remove();
    }
  }
});
