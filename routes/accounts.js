

module.exports = (app) => {

  app.post('/login', (req, res) => {
    var params = req.body;
    params.type = "login in progress";
    res.send(params);
  });

  app.post('/create', (req, res) => {
    var params = req.body;
    params.type = "create account in progress";
    res.send(params);
  });

}
