

module.exports = (app) => {
  app.get('/test', (req, res) => {

    var context = {
      layout: "_test",
      css: [
        "toastr.min.css",
        "main.css",
        "navbar.css",
        "leaflet.css",
//        "semantic.min.css",
//        "bootstrap.min.css"
      ], 
      js: [
        "jquery-3.3.1.min.js",
        "toastr.min.js",
        "_test.js",
	"request.js",
	"ajax.js",
        "canvas.js",
        "graph.js",
        "d3.v5.min.js",
        "leaflet_1.3.4.js",
        "rough.js",
//        "semantic.min.js",
//        "popper.min.js",
//        "bootstrap.min.js",
//        "seed.js",
//        "crawl.js"

      ]
    };

    view = "../views/_test.handlebars";
    res.render(view, context);
  }),

  app.get('/', (req, res) => {
    loginFlag = false;
    if(req.user) {
      loginFlag = true;
    }
    
    var context = {
      layout: "index",
      user: req.user,
      loginFlag: loginFlag,
      css: [
        "toastr.min.css",
        "main.css",
        "navbar.css",
        "leaflet.css",
//        "semantic.min.css",
//        "bootstrap.min.css"
      ], 
      js: [
        "jquery-3.3.1.min.js",
        "toastr.min.js",
        "_main.js",
	"request.js",
	"ajax.js",
        "d3.v5.min.js",
        "leaflet_1.3.4.js"
//        "semantic.min.js",
//        "popper.min.js",
//        "bootstrap.min.js",
//        "seed.js",
//        "crawl.js"

      ]
    };

    var view = "../views/home.handlebars";
    view = "../views/_graph.handlebars";
    if(req.user) {
      view = "../views/graph.handlebars";
    }
    console.log(req.user)
    res.render(view, context);
  });

}
