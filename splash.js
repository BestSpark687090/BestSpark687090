// SplashJS - A simple library to add text splashes to your website. Made by BestSpark687090.

// this is here to make the lil version number. also here to check if the DOM got loaded.
// We can't use lowercase splashjs because that would be confused with the function name.

let splashJS = {
  version: "1.0.2-SPRK",
  isDOMLoaded: false,
};
console.log(
  `[SplashJS] SplashJS ${splashJS.version} loaded! - Made by BestSpark687090 %c(Find me anywhere with that name!)`,
  "color: gray; font-size: 75%;",
);

class tooLazyError extends Error {
  constructor(message) {
    // Need to pass `options` as the second parameter to install the "cause" property.
    super(
      `[SplashJS] TODO: ${message} - Please try to avoid this until the next update.`,
      {},
    );
  }
}
document.addEventListener("DOMContentLoaded", function () {
  console.log("[SplashJS] DOM Loaded");
  splashJS.isDOMLoaded = true; // Can I even do this?
});
/**
 * Here's how it looks:
 * ```js
 * splashjs({
 *  preset: '', // Doesn't overwrite all options but has set ones that will be used as defaults if they're not set. - Not Implemented and not in the docs - It also doesn't do anything.
 *  // Actually i'm not too sure about that. I'll have to think about it.
 *  target: "", // Query Selector, eg #icon - Actually always needed
 *  targets: "", // Query Selector, eg .icons - REPLACES target if set. If both, throws error.
 *  splashes: ["Splash 1", "Splash 2", "etc splashes"], // duh
 *  color: "", // Hex code or RGB value thingy
 *  font: "", // Optional, uses the default font
 *  rotation: 0, // any number between -360 and 360 prolly?
 *  border: "", // A CSS border thing. But... for the text? Does that exist?
 *  fontSize: 0, // a number. duh. Or... actually maybe even those words that CSS provides.
 *  animation: "", // Defaults to the bounce animation. Allows users to set their own!
 *  // actually what if i make the animation thing an object. ofc i let them add some sort of animation.
 *  // if its an array it defaults to 1s that goes on forever
 *  // if its an empty string there will be NO animation
 *  moveInterval: 0, // In milliseconds. It's the setInterval that checks offsetWidth and offsetTop.
 *
 *  // obviously im gonna add more as this goes on
 * })
 * ```
 * OH and DONT forget accessibility.
 * Make sure it doesn't animate WHATSOEVER if reduce motion is on
 */
async function splashjs(options = {}) {
  const presetDefault = {
    color: "#ffff55",
    font: "Arial",
    rotation: -45,
    border: "none",
    fontSize: "x-large",
    animation: {
      movement: [
        { transform: "scale(1) rotate(-45deg)" },
        { transform: "scale(1.25) rotate(-45deg)" },
        { transform: "scale(1) rotate(-45deg)" },
      ],
      timing: {
        duration: 3000,
        iterations: Infinity,
        fill: "forwards",
      },
    },
    moveInterval: 250,
  };
  if (!splashJS.isDOMLoaded) {
    console.log(
      "[SplashJS] DOM isn't loaded yet. Waiting for it to load so images don't get messed up.",
    );
    // Wait until DOM is loaded, then run it again.
    document.addEventListener("DOMContentLoaded", function () {
      splashjs(options);
    });
    return; // stop because thats bad
  }
  // Use the default preset if the user doesn't specify one.
  // if (options.preset == undefined) {
  //     options.preset = "default";
  // } else {
  //     options = {
  //         ...presetDefault,
  //         ...options,
  //     };
  // }
  // TODO IF YOU WANT TO: reimplement preset system!
  options = {
    ...presetDefault,
    ...options,
  };
  // console.log("SplashJS run");
  if (options.targets != undefined && options.target == undefined) {
    // if they set targets but not target, recursively call this with an element
    document.querySelectorAll(options.targets).forEach((target) => {
      // wait i need to remove targets out of this
      options.targets = undefined;
      splashjs({
        target: target,
        ...options,
      });
      // oh yeah i need to implement the element check
    });
  } else if (options.targets != undefined && options.target != undefined) {
    throw new Error(
      "[SplashJS] You can't set both the 'target' and 'targets' options.\nThat ain't how it works!",
    );
  }
  // console.log("Hello! You've reached SplashJS. heres the options",options)
  if (options.target == undefined) {
    throw new Error(
      "[SplashJS] Target of splash was not specified.\nPlease add the 'target' option to the initalizer.",
    );
  }
  let target;
  // Create a text element with a good positioning
  if (options.target instanceof HTMLElement) {
    target = options.target;
  } else {
    target = document.querySelector(options.target);
  }
  let xPos = 0;
  let yPos = 0;

  let splash = document.createElement("p");
  splash.innerHTML =
    options.splashes[Math.floor(Math.random() * options.splashes.length)];
  splash.style.position = "absolute";
  // // TODO: REMOVE
  // function isOutOfViewport(el) {
  //     const rect = el.getBoundingClientRect();
  //     const windowHeight =
  //         window.innerHeight || document.documentElement.clientHeight;
  //     const windowWidth =
  //         window.innerWidth || document.documentElement.clientWidth;

  //     return (
  //         rect.top > windowHeight ||
  //         rect.bottom < 0 ||
  //         rect.left > windowWidth ||
  //         rect.right < 0
  //     );
  // }
  // // TODO: Probably make this better.
  // // Also does die if the view starts out scrolled.
  // //... i know its not needed, but i need to fix it eventually anyways.
  // if (isOutOfViewport(target)) {
  //     // mark, this is good news. we can finally be bees.
  //     splash.style.position = "absolute";
  // } else {
  //     splash.style.position = "absolute";
  // }
  // If their rotation's a string dont add the deg
  if (typeof options.rotation == "number") {
    options.rotation = parseFloat(options.rotation) + "deg";
  }
  // no else up above cause it SETS rotation to make it work.
  splash.style.transform = `rotate(${options.rotation})`;
  splash.style.fontFamily = options.font;
  // some guy on stackoverflow said -webkit-text-stroke works fine so ill try that
  // how do i even set that from here?
  //splash.style.pointerEvents = "none"; // Lets me use the textarea
  // WEBSITE EXCLUSIVE???: Remove pointerEvents and make it use userSelect none so I can change the text on click
  // oh yeah that works GREAT with moveInterval
  splash.style.userSelect = "none";
  splash.style.color = options.color;
  splash.style.webkitTextStroke = options.border;
  splash.style.fontSize = options.fontSize;
  splash.style.textAlign = "center";
  // if they make it stupid that's their fault and its gonna default to bounce.
  if (
    typeof options.animation != "object" &&
    typeof options.animation == "string"
  ) {
    throw new tooLazyError("Implement custom animations from CSS");
  } else {
    // USE THE CORRECT ANGLE FROM THE OPTIONS
    options.animation.movement = [
      { transform: `scale(1) rotate(${options.rotation})` },
      { transform: `scale(1.25) rotate(${options.rotation})` },
      { transform: `scale(1) rotate(${options.rotation})` },
    ];
    splash.animate(options.animation.movement, options.animation.timing);
  }
  // WEBSITE EXCLUSIVE AS OF RIGHT NOW: Clicking on the splash text changes it.
  // wait genuine question, css has the pointer events set to none
  // so what happens if i click it?
  splash.addEventListener("click", function(){
    splash.innerHTML =
      options.splashes[Math.floor(Math.random() * options.splashes.length)];
  })
  splash.id = "splashjs"
  // If it's a string then they PROBABLY? don't want anything
  // BUT we want custom animations. Gotta figure that out!
  // Probably just use the object...
  document.body.appendChild(splash);

  function setStuff(splash, target) {
    // !!magic number alert!! - it just feels... right.
    // If the offsetHeight is double the computed font size, it means it was wrapped.
    // Add the -10 if it does
    const computedFontSize = parseFloat(
      window
        .getComputedStyle(splash)
        .getPropertyValue("font-size")
        .slice(0, -2),
    );
    let adjustion = 10;
    if (computedFontSize > splash.offsetHeight) {
      adjustion = -10;
    }
    function getTranslateXY(element) {
      const style = window.getComputedStyle(element);
      const matrix = new DOMMatrixReadOnly(style.transform);

      return {
        x: matrix.m41, // Translate X
        y: matrix.m42, // Translate Y
      };
    }
    const translate = getTranslateXY(target);
    yPos =
      target.offsetTop +
      target.offsetHeight +
      translate.y +
      // window.scrollY
      adjustion;
    xPos = target.offsetLeft + target.offsetWidth + translate.x;

    splash.style.left = `${xPos - splash.offsetWidth / 2}px`;
    splash.style.top = `${yPos - splash.offsetHeight}px`;
  }
  if (target.complete && target.naturalWidth > 0) {
    setStuff(splash, target);
    // console.log("stuff was set cause it was alr done");
  } else {
    target.addEventListener("load", function () {
      setStuff(splash, target);
      // console.log("stuff was set cause load");
    });
  }
  // While I'm here, might as well implement the adjustion fix
  // If statement checks if moveInterval isn't parsable to a number.
  // Does actually kinda help if people put numbers in strings.
  // Mostly meant to check if the moveInterval's an empty string.
  options.moveInterval = options.moveInterval ?? ""; // Default to not move
  if (!isNaN(parseInt(options.moveInterval))) {
    let ogOfL = target.offsetLeft;
    let ogOfT = target.offsetTop;
    // eh- do those really need to be checked...?
    // might be nice. ill just do L and T for now
    let ogOfH = target.offsetHeight;
    let ogOfW = target.offsetWidth;
    setInterval(function (e) {
      //if (ogOfL != target.offsetLeft || ogOfT != target.offsetTop) {
      setStuff(splash, target);
      //}
    }, options.moveInterval ?? 1000);
  } else {
    // Just double checking, make it right.
    setStuff(splash, target);
  }
  // idk if that'll work good in the end but... eh.
}

// Website - Set up SplashJS for the title part.
// This'll be `defer`red so it *should* work fine, but IDK about SplashJS up there.
async function startup(){
// In an async function because I want to fetch splashes from a textfile.
  const res = await fetch("./splashes.txt"); // Relative can let me separate main and games section!
  const txt = await res.text();
  const splashescycle = txt.split("\n");
  let splashes = [];
  for (let splash of splashescycle){
    if (splash.startsWith("#")||splash.trim() == ""){}else{
      splashes.push(splash);
    }
  }
const titlePart = document.querySelector(".title-part");
titlePart.innerHTML = `<span>${titlePart.innerHTML}</span>`; // Before: [title]. After: <span>[title]</span>.
splashJS.isDOMLoaded = true;
splashjs({
  target: ".title-part > span",
  splashes,
  fontSize: "medium",
  rotation: -10.5,
  font: "IBM Plex Sans"
});

}
startup();
