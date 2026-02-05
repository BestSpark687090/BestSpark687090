document.querySelectorAll("a").forEach(function (e) {
   e.addEventListener("click", async function (el) {
      debugger;
      let href = e.pathname||e.getAttribute("href");
      if (!href.startsWith("http") && !href.startsWith("mailto")) {
         if (href == "/") {
            href = "/index.html";
         }
         if(!href.startsWith("/")){
            href = "/"+href
         }
         el.preventDefault();

         // we do it
         let path =
            // Main use i think
            "https://cdn.jsdelivr.net/gh/BestSpark687090/BestSpark687090@main";
            //"https://cdn.statically.io/gh/BestSpark687090/BestSpark687090@main";
         let html = await fetch(path+href);
         let htmltxt = await html.text();

         let js = await fetch(path + "/script.js");
         let jstxt = await js.text();

         let css = await fetch(path + "/style.css");
         let csstxt = await css.text();

         let code = await fetch(path + "/bookmark_code.js");
         let codetxt = await code.text();
         const newWin = window.open("about:blank", "_blank");

         if (newWin) {
            newWin.document.open();

            newWin.document.write(htmltxt);
            newWin.document.write("<style>" + csstxt + "</style>");

            newWin.document.write(
               // end of script tag is atob'd cause it may escape itself
               "<script>" + jstxt + codetxt + atob("PC9zY3JpcHQ+"),
            );
            newWin.document.close();
         }
      }
   });
});