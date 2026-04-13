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
  "https://multiversodigital.net/wp-content/plugins/super-links/application/helpers/super-links-proxy.php?",
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

function filterOthersList() {
  if (location.href.includes("others.html")) {
    // go on.
    // meh i can do this later
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
// location.hostname.split(".").slice(-2)
const hostnamesThatarentTheProxy = [
  "onrender.com",
  "vercel.app",
  "netlify.app",
  "pages.dev",
  "replit.app",
  "code.run",
  "railway.app",
  "koyeb.app",
  "fastly.net",
  "codehs.me",
  "fly.dev",
  "w3spaces.com",
  "w3spaces-preview.com",
  "atwebpages.com",
  "edgeone.dev",
  "xo.je",
  "replit.dev",
  "googleapis.com",
  "deno.net",
  "surge.sh",
  "github.io",
];
const hostname = location.hostname.split(".").slice(-2).join(".");
if (!hostnamesThatarentTheProxy.includes(hostname)) {
  // Again, find these links here: https://discord.gg/DbpbufYesj
  // document.querySelector("#uv-proxy").setAttribute("href","/proxy/");
  let loops = ["Ultraviolet", "Scramjet"];
  let loopURLs = ["/proxy/","/sjp/"];
  let divs = [];
  let i=0;
  for (let name of loops) {
    let groupDiv = document.createElement("div");
    groupDiv.classList.add("group");
    let subtext = document.createElement("span");
    subtext.classList.add("subtext");
    subtext.innerHTML = "(Yes, built-in to the site you're using right now.)";
    let proxyThing = document.createElement("h2");
    // proxyThing.innerHTML="<a href=\"/proxy/\">Built-in Proxy</a>"
    let proxyA = document.createElement("a");
    proxyA.setAttribute("href", loopURLs[i]);

    proxyA.innerText = `Built-in ${name} <rot13>Cebkl</rot13>`;
    if(document.querySelector(".proxies") != null){
      proxyA.innerText = `Built-in ${name} <rot13>Cebkl</rot13> (Made by me)`;
    }
    proxyThing.appendChild(proxyA);
    groupDiv.appendChild(proxyThing);
    groupDiv.appendChild(subtext);
    divs.push(groupDiv);
    i++;
  }
  try {
    for (let div of divs) {
      document.querySelector(".gradient > .text").appendChild(div);
    }
  } catch (e) {
    for (let div of divs) {
      document.querySelector(".proxies").appendChild(div);
    }
  }
}

let checked = false;
function changetodotOrg(){
  checked = true;
  document.querySelectorAll(".change").forEach(function(e){
    const changeTo = e.className.replace("change ","");
    e.href = `https://${changeTo}.bestspark.org`
  })
}

// Check if Linewize is installed or on bestspark.org to replace links with the bestspark.org version
fetch("chrome-extension://ifinpabiejbjobcphhaomiifjibpkjlf/background/assets/imgs/Close.svg").then(changetodotOrg)
if(location.hostname == "bestspark.org" && !checked){
  changetodotOrg();
}

// TECHNIQUE - Open the sites in an about:blank
document.querySelectorAll(".games > a, .games > .group > a, .proxies > a, .proxies > .group > a").forEach(function(e){
  if(!e.href.includes("jsdelivrs")){
    e.addEventListener("click",function(ev){
      ev.preventDefault();
      const t = window.open("about:blank","_blank")
      t.document.write(`<style>body{margin:-1}</style><iframe src="${e.href}" style="width:100%; height:100%; border:none;"></iframe>`)
      t.document.close()
    })
  }
})