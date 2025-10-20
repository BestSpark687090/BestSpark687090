// What if I write a script to check for blocked/unblocked sites?
// hmmmmmmmm
let els = document.querySelectorAll(".gradient a")
for (let e of els){
  if (e.href.includes(location.host)){
    continue; // Don't.
  }
  async function doesRedirect(url) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        // mode: 'no-cors',
        cache: "no-cache",
        redirect: 'follow',
        headers: {
          // "accept": "*/*",
          // "accept-language": "en-US,en;q=0.9",
          // "cache-control": "max-age=0",
          // "priority": "u=1, i",
          // "sec-fetch-dest": "empty",
          // "sec-fetch-mode": "cors",
          "User-Agent":"Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
        }
      });
      // Try to get the text rq
      const text = await response;
      console.log(text)
      // The `response.url` will be the final URL after any redirects
      // setTimeout(function(){
      //   console.log(response.url,"Url")
      // },1000)
      return response.redirected;

    } catch (error) {
      // A CORS error or network error occurred before the redirect could be handled
      console.error("Fetch failed:", error);
      debugger; // AAAAA
      return false;
    }
  }
  (async function(e) {
  //fetch from the url
  // alert(e.href)
  try {
    /**
     * Vercel apps work fine with: GET, no-cache, and same-origin credentials
     * NOTHING works with no-cors :/
     */
    // let response = await fetch(e.href, {
    //   method: "OPTIONS",
    //   // mode: "no-cors",   
    //   // mode: "cors",
    //   cache: "no-cache",
      
    //   headers: {
    //     "accept": "*/*",
    //     "accept-language": "en-US,en;q=0.9",
    //     "cache-control": "max-age=0",
    //     "priority": "u=1, i",
    //     "sec-fetch-dest": "empty",
    //     "sec-fetch-mode": "cors",
    //     "sec-fetch-site": "cross-site"
    //   }
    //   // credentials: "same-origin",
    //   // redirect: "follow",
    //   // referrerPolicy: "no-referrer"
    // });
    let uhhh = await doesRedirect(e.href)
    // console.log(e.href,uhhh)
    // console.log(response)
    // if (response.status == 200) {
    //   e.classList.add("unblocked");
    // } else if (response.status == 302) {
    //   e.classList.add("blocked");
    // } else {
    //   console.log(e.href + " is erroring")
    // }
  } catch (e) {
    console.log(e)
  }
  })(e);
}