
// link to get the commit stuff
// raw: https://api.github.com/repos/BestSpark687090/BestSpark687090/commits/main
// token i guess

let urlToFetch = "https://api.github.com/repos/BestSpark687090/BestSpark687090/commits/main";
(async () => {
  let res = await fetch("https://api.codetabs.com/v1/proxy?quest="+urlToFetch);
  let txt = await res.json(); // its gonna be in json
  let res2 = await fetch("https://api.codetabs.com/v1/tmp?quest="+txt.url);
  let txt2 = await res2.json();
  console.log(txt2.commit.message);
  /**<div class="latestCommitMessage">
    <span>Latest Commit Message: <p></p></span>
  </div> */
  let div = document.createElement("div");
  div.classList.add("latestCommitMessage");
  let span = document.createElement("span");
  span.innerText = "Latest Commit Message: "+txt2.commit.message;
  div.appendChild(span);
  document.body.appendChild(div);
})();
