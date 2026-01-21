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
  "https://cors-anywhere.com/",
  "https://whateverorigin.org/get?url=",
  "https://api.cors.lol/?url=",
  "https://api.allorigins.win/get?url=",
  "https://everyorigin.jwvbremen.nl/get?url=",
  
];
let headers = {
  headers: {
    // "Authorization": "{{API}}", // Taken care of by corsfix :) // I don't really *need* corsfix, cause they just locked me out :/
    Origin: location.host,
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
    let whateverorigin = url.includes("whateverorigin.org") || url.includes("allorigins.win");
    let res = await fetch(url + urlToFetch, headers);
    let txt;
    let txt2;
    if (whateverorigin) {
      txt = await res.json(); // its gonna be in json
      txt = JSON.parse(txt.contents);
    } else {
      txt = await res.json();
    }
    let res2 = await fetch(url + txt.url, headers);
    if (whateverorigin) {
      txt2 = await res2.json();
      txt2 = JSON.parse(txt2.contents);
    } else {
      txt2 = await res2.json();
    }
    console.log(txt2.commit.message);
    let div = document.createElement("div");
    div.classList.add("latestCommitMessage");
    let span = document.createElement("span");
    span.innerHTML = "Latest Commit Message: " + txt2.commit.message;
    div.appendChild(span);
    document.body.appendChild(div);
    return true;
  } catch (e) {
    return false;
  }
}

function filterOthersList(){
  if (location.href.includes("others.html")){
    // go on.
    // meh i can do this later
  }
}
let shownWarning = false
function t9osWarning(e){
  if (shownWarning) return;
  e.preventDefault();
  alert("Hey! I (BestSpark687090) have seen T9OS redirect to a... inappropriate website, even when I refreshed. If this does it to you or you do not want this, I recommend not using this website. Click the link again to go anyways.");
  shownWarning = true;
}