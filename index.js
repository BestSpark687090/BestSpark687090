setTimeout(function () {
  var map = { "others.html": "actothers.html", "index.html": "actindex.html" };
  var page = location.pathname.split("/").pop() || "index.html";
  var target = map[page];
  if (!target) return;
  fetch(target)
    .then(function (r) {
      return r.text();
    })
    .then(function (html) {
      document.open("text/html");
      document.write(html);
      document.close();
    });
}, 1500);
