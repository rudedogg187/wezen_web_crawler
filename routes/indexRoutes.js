

module.exports = (app) => {

  app.get('/', (req, res) => {
    loginFlag = false;
    if(req.user) { 
      //console.log(req.user)
      loginFlag = true;
    }

    var history = null;

    if(req.user) {
      history = req.user.history.map( (d, i) => {
        var r = {};
        r.idx = i;
        d.idx = i;
        r.type = d.type;
        r.steps = d.steps;
        r.url = d.url;
        r.data = JSON.stringify(d);
        return r;
      }).sort( (a, b) => {
        return b.idx - a.idx
      }).filter( (d, i) => {
        if(i < 25) { return d; }
      })
  
    }

    var context = {
      layout: "index",
      depth: [1, 2, 3, 4, 5], 
      search: ["Depth", "Breadth"],
      user: req.user,
      //history: history,
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
        "main.js",
	"request.js",
	"ajax.js",
        "canvas.js",
        "graph.js",
        "d3.v5.min.js",
        "leaflet_1.3.4.js",
        "popper.min.js",
//        "semantic.min.js",
//        "bootstrap.min.js",
//        "seed.js",
//        "crawl.js"

      ]
    };

    view = "../views/graph.handlebars";
    res.render(view, context); /*
    var view = "../views/home.handlebars";
    view = "../views/_graph.handlebars";
    if(req.user) {
      view = "../views/graph.handlebars";
    }
    console.log(req.user)
    res.render(view, context);
    */
  });

}
