

module.exports = (app) => {

  app.get('/', (req, res) => {
    var context = {
      css: [
        "main.css",
        "semantic.min.css",
        "bootstrap.min.css",
      ], 
      js: [
        "jquery-3.3.1.slim.min.js",
        "main.js",
        "d3.v5.min.js",
        "semantic.min.js",
        "popper.min.js",
        "bootstrap.min.js",
      ]
    };

    res.render('../views/home.handlebars', context);
  });

}
