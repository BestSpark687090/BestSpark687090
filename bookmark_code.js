document.querySelectorAll("a").forEach(function (e) {
   e.addEventListener("click", async function (el) {
      let href = e.getAttribute("href");
      if (!href.startsWith("http") && !href.startsWith("mailto")) {
         if (href == "/") {
            href = "/index.html";
         }

         el.preventDefault();

         // we do it
         let path =
            "https://cdn.jsdelivr.net/gh/BestSpark687090/BestSpark687090/";
         let html = await fetch(path + "index.html");
         let htmltxt = await html.text();

         let js = await fetch(path + "script.js");
         let jstxt = await js.text();

         let css = await fetch(path + "style.css");
         let csstxt = await css.text();

         let code = await fetch(path + "bookmark_code.js");
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
