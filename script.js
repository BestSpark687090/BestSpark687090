
// link to get the commit stuff
// raw: https://api.github.com/repos/BestSpark687090/BestSpark687090/commits/main
//https://proxy.corsfix.com/?
// token i guess:
// and yes im sure this is fine, because all it can do is access public repositories and stuff
// TODO: make TOS visible at all times
let urlToFetch = "https://api.github.com/repos/BestSpark687090/BestSpark687090/commits/main";
let fetchingURL = "https://proxy.corsfix.com/?"
let headers = {
  headers: {
    "Authorization": "{{API}}", // Taken care of by corsfix :)
    "Origin": location.host
  }
};
(async () => {
  let res = await fetch(fetchingURL + urlToFetch, headers);
  let txt = await res.json(); // its gonna be in json
  let res2 = await fetch(fetchingURL + txt.url, headers);
  let txt2 = await res2.json();
  console.log(txt2.commit.message);
  let div = document.createElement("div");
  div.classList.add("latestCommitMessage");
  let span = document.createElement("span");
  span.innerText = "Latest Commit Message: " + txt2.commit.message;
  div.appendChild(span);
  document.body.appendChild(div);
})();
async function fetched(body){
  let res2 = await fetch(fetchingURL + body.body.url, headers);
  let txt2 = await res2.json();
  console.log(txt2.commit.message);
  let div = document.createElement("div");
  div.classList.add("latestCommitMessage");
  let span = document.createElement("span");
  span.innerText = "Latest Commit Message: " + txt2.commit.message;
  div.appendChild(span);
  document.body.appendChild(div);
}