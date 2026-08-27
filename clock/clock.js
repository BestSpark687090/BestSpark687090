let timesEscapePressed = 0;
let clockOn = false;
let iframe = document.createElement("iframe");
iframe.src = "/clock/index.html";
iframe.classList.add("clock-frame");
iframe.style.position = "fixed";
iframe.style.top = "0";
iframe.style.left = "0";
iframe.style.width = "100%";
iframe.style.height = "100%";
iframe.style.zIndex = "2147483647";
iframe.style.display = "none";
document.body.appendChild(iframe);
// This probably isn't the best way to get this done, but here's my idea
document.addEventListener("keyup", function (e) {
  if (e.code == "Escape") {
    timesEscapePressed++;
  }
  if (timesEscapePressed >= 3) {
    timesEscapePressed = 0;
    // cloak
    if (!clockOn) {
      //document.body.appendChild(iframe);
      iframe.style.display = "block";
      clockOn = true;
    } else {
      clockOn = false;
      iframe.style.display="none";
      //document.querySelector(".clock-frame").remove();
    }
  }
  if (e.code == "KeyC") {
    alert("this is meant to give you about:blank. not implemented yet - bestspark")
  }
});
