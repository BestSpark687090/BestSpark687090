// link to get the commit stuff
// raw: https://api.github.com/repos/BestSpark687090/BestSpark687090/commits/main
// token i guess:
// and yes im sure this is fine, because all it can do is access public repositories and stuff
// TODO: make TOS visible at all times
/**
 * CORS PROXIES TO USE:
 * https://api.cors.lol/?url= : GOOD
 * https://whateverorigin.org/get?url= : MODIFIES THE RESPONSE TO BE IN A CONTENTS JSON
 * https://cors-anywhere.com/ : GOOD
 * https://api.allorigins.win/get?url= : good
 * https://everyorigin.jwvbremen.nl/get?url= : modifies it to be inside of an html object?
 */
let urlToFetch =
  "https://api.github.com/repos/BestSpark687090/BestSpark687090/commits/main";
let fetchers = [
  "https://cors.bestspark687090.workers.dev/?",
  "https://cors-anywhere.com/",
  "https://whateverorigin.org/get?url=",
  "https://api.cors.lol/?url=",
  "https://api.allorigins.win/get?url=",
  "https://everyorigin.jwvbremen.nl/get?url=",
  "", // empty on purpose to just make it use the raw url
];
let headers = {
  headers: {
    // "Authorization": "{{API}}", // Taken care of by corsfix :) // I don't really *need* corsfix, cause they just locked me out :/
    Origin: location.hostname,
  },
};
(async () => {
  for (let fetcher of fetchers) {
    // console.log("Using "+fetcher)
    if (await fetched(fetcher)) {
      break;
    }
  }
})();
async function fetched(url) {
  try {
    let whateverorigin =
      url.includes("whateverorigin.org") || url.includes("allorigins.win");
    let res = await fetch(url + urlToFetch, headers);
    let txt;
    // let txt2;
    if (whateverorigin) {
      txt = await res.json(); // its gonna be in json
      txt = JSON.parse(txt.contents);
    } else {
      txt = await res.json();
    }
    // if (txt.url == undefined){
    //   return false; // rate limit hit...
    // }
    // let res2 = await fetch(url + txt.url, headers);
    // if (whateverorigin) {
    //   txt2 = await res2.json();
    //   txt2 = JSON.parse(txt2.contents);
    // } else {
    //   txt2 = await res2.json();
    // }
    let message = txt.commit.message;
    console.log(message);
    let div = document.createElement("div");
    div.classList.add("latestCommitMessage");
    let span = document.createElement("span");
    span.innerHTML = "Latest Commit Message: " + message;
    div.appendChild(span);
    document.body.appendChild(div);
    return true;
  } catch (e) {
    return false;
  }
}

let shownWarning = false;
function t9osWarning(e) {
  if (shownWarning) return;
  e.preventDefault();
  alert(
    "Hey! I (BestSpark687090) have seen T9OS redirect to a... inappropriate website, even when I refreshed. If this does it to you or you do not want this, I recommend not using this website. Click the link again to go anyways.",
  );
  shownWarning = true;
}
// #region change link
let checked = false;
function changeToDomain(domain) {
  checked = true;
  document.querySelectorAll(".change").forEach(function (e) {
    const changeTo = e.className.replace("change ", "");
    e.href = `https://${changeTo}.${domain}`;
  });
}

// Check if Linewize is installed or on bestspark.org to replace links with the bestspark.org version
// fetch("chrome-extension://ifinpabiejbjobcphhaomiifjibpkjlf/background/assets/imgs/Close.svg").then(changetodotOrg)
if (location.hostname == "bestspark.org" && !checked) {
  changeToDomain("bestspark.org");
}
if (location.hostname == "bestspark.qzz.io" && !checked) {
  changeToDomain("bestspark.qzz.io");
}
// #endregion change link
// #region the about:blanker
let doneARightClick = false;
// TECHNIQUE - Open the sites in an about:blank
function openInAboutBlank(ev) {
  ev.preventDefault();
  const t = window.open("about:blank", "_blank");
  t.document.write(
    `<!-- Google tag (gtag.js) (Heheheha) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XEY66QJESF"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());

      gtag("config", "G-XEY66QJESF");
    </script>
          <style>body{margin:-1;overflow:hidden;}</style><iframe src="${e.href}" allowfullscreen="true" style="width:100%; height:100%; border:none;"></iframe>`,
  );
  t.document.close();
}
// about:blank warning- obviously
function addAboutBlankWarning(ev) {
  if (!doneARightClick) {
    ev.preventDefault();
    alert(
      "Hey just so you know I have these go to about:blank for a reason... It gets past some techniques schools use anyways. If you want to, just right click again.",
    );
    doneARightClick = true;
  }
}
function aboutBlankEls() {
  document
    .querySelectorAll(
      ".games > a, .games > .group > a:not(.ab-exclude), .proxies > a, .proxies > .group > a",
    )
    .forEach(function (e) {
      if (!e.href.includes("jsdelivrs")) {
        e.addEventListener("click", openInAboutBlank);

        e.addEventListener("contextmenu", addAboutBlankWarning); // right click
      }
    });
}
if (window.localStorage.getItem("aboutBlank") == "true") {
  aboutBlankEls(); // in a function when I need to redo the stuff
}
document.addEventListener("keyup", function (e) {
  if (e.key == "a") {
    const warning = document.querySelector("u");
    if (warning.style.display == "none") {
      warning.style.display = "block";
      window.localStorage.setItem("aboutblank", "true");
      // remove the event listeners for about:blank
      document
        .querySelectorAll(
          ".games > a, .games > .group > a:not(.ab-exclude), .proxies > a, .proxies > .group > a",
        )
        .forEach(function (e) {
          if (!e.href.includes("jsdelivrs")) {
            e.removeEventListener("click", openInAboutBlank);

            e.removeEventListener("contextmenu", addAboutBlankWarning); // right click
          }
        });
    } else {
      warning.style.display = "none";
      window.localStorage.setItem("aboutblank", "false");
      aboutBlankEls(); // the function is used!
    }
  }
});
// and uhh make sure to load the aboutblanker
document.addEventListener("DOMContentLoaded", function () {
  if (window.localStorage.getItem("aboutblank") == "true") {
    document.querySelector("u").style.display = "block";
  }
});
// #endregion the about:blanker
const hostnamesThatarentTheProxy = [
  "onrender.com",
  "vercel.app",
  "netlify.app",
  "pages.dev",
  "replit.app",
  "code.run",
  "railway.app",
  //"koyeb.app",
  "fastly.net",
  "codehs.me",
  "fly.dev",
  "w3spaces.com",
  "w3spaces-preview.com",
  "atwebpages.com",
  "edgeone.dev",
  "xo.je",
  // "replit.dev",
  "googleapis.com",
  "deno.net",
  "surge.sh",
  "github.io",
  "amplifyapp.com",
  "firebaseapp.com",
  "web.app",
];
const hostname = location.hostname.split(".").slice(-2).join(".");
// FREEDNS LINK HERE:
let link = "https://physics.senior.choir.recess.engineering.apibuddy.com";
if (!hostnamesThatarentTheProxy.includes(hostname)) {
  link = location.origin;
}
document.querySelector(".pxy1").href = link + "/pxy/";
document.querySelector(".pxy2").href = link + "/sjp/";
document.querySelector(".gmslink").href = link + "/games/";

// DEBUG COMMAND: add a element to whatever the first game div is. Take in a name and URL
function addGame(name, url) {
  let a = document.createElement("a");
  a.href = url;
  a.innerHTML = name; // bad idea but its called a debug command for a reason
  document.querySelector(".games").appendChild(a);
}

// index.html tabs
document.querySelectorAll(".tab-list > button").forEach(function (e) {
  // the buttons will be referenced by their id which is the panel they show
  e.addEventListener("click", function () {
    document.querySelector(".active").classList.remove("active");
    e.classList.add("active");
    document
      .querySelector(".tabs > div:not(.start-hidden)")
      .classList.add("start-hidden");
    document.querySelector(`div#${e.id}`).classList.remove("start-hidden");
  });
});
