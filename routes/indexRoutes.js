

module.exports = (app) => {
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
//        "semantic.min.css",
//        "bootstrap.min.css"
      ], 
      js: [
        "jquery-3.3.1.min.js",
        "toastr.min.js",
        "main.js",
	"request.js",
	"ajax.js",
        "d3.v5.min.js",
//        "semantic.min.js",
//        "popper.min.js",
//        "bootstrap.min.js",
//        "seed.js",
//        "crawl.js"

      ]
    };

    var view = "../views/home.handlebars";
    if(req.user) {
      view = "../views/graph.handlebars";
    }
    console.log(req.user)
    res.render(view, context);
  });

}
