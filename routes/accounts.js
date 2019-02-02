var seedAccountHistory = [
  { dt: "2019-01-15 23:13:54", url: "google.com", id: 776 },
  { dt: "2019-01-17 04:22:04", url: "yahoo.com", id: 876 },
  { dt: "2019-01-18 08:43:18", url: "craigslist.org", id: 987 },
  { dt: "2019-01-21 13:28:11", url: "oregon.gov", id: 1098 },
  { dt: "2019-01-25 09:54:16", url: "ebay.com", id: 3457 },
  { dt: "2019-01-26 13:09:54", url: "stackoverflow.com", id: 3501 },
  { dt: "2019-01-31 16:17:34", url: "zillow.com", id: 3510 },
]

var seedUser = {
  first: "Testie", last: "Testerson",
}

module.exports = (app) => {

  app.post('/login', (req, res) => {
    var params = req.body;
    context = {};
    context.history = seedAccountHistory;
    context.user = seedUser;
    res.send(context);
  });

  app.post('/create', (req, res) => {
    var params = req.body;
    params.type = "create account in progress";
    res.send(params);
  });

}
