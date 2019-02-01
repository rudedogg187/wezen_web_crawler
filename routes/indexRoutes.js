

module.exports = (app) => {

  app.get('/', (req, res) => {
    var context = {
      layout: "index",
      css: [
        "main.css",
//        "semantic.min.css",
//        "bootstrap.min.css"
      ], 
      js: [
        "jquery-3.3.1.min.js",
        "main.js",
	"request.js",
	"ajax.js",
        "d3.v5.min.js",
//        "semantic.min.js",
//        "popper.min.js",
//        "bootstrap.min.js",
        "seed.js"
        "semantic.min.js",
        "popper.min.js",
        "bootstrap.min.js",
        "crawl.js"

      ]
    };

    res.render('../views/home.handlebars', context);
  });

}
