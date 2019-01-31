module.exports = (app, request, cheerio, URL, bodyParser) => {

  app.post('/crawl/depth', (req, res) => {
    var firstUrl = req.body.url;
    var word = req.body.word;
    var steps = req.body.steps;
    // Validate params
    var collection = []; 
    depthCrawl(1, 0, steps, word, firstUrl, collection, res); 
  });

  function depthCrawl(idCounter, steps, maxSteps, word, pageToCrawl, collection, res) {
    var url = new URL(pageToCrawl);
    var baseurl = url.protocol + "//" + url.hostname;
    request(pageToCrawl, function(error, response, body) {
      if(response && response.statusCode == 200) {
        var $ = cheerio.load(body);
        var wordFound = false;
        if(doesWordExist($, word)) {
          wordFound = true;
        }
        var anchorTags = $('a');
        var currentUrls = [];
        anchorTags.each(function(index, anchorTag) {
          if($(anchorTag).attr('href') != undefined) {
            var urlString = $(anchorTag).attr('href');
            if(urlString.startsWith('//') || urlString.startsWith('#')) {
            }
            else if(urlString.startsWith('/')) {
              urlString = baseurl + urlString;
              currentUrls.push(urlString);
            }
            else if(urlString.startsWith('http')) {
              currentUrls.push(urlString);
            }
          }
        });
        // Need to randomize logic
        var chosenUrl = currentUrls[Math.floor(Math.random() * currentUrls.length)];
        var newNode = createNode(idCounter++, chosenUrl);
        steps++;
        if (collection.length > 0) {
          var parentNode = collection.pop(); 
          parentNode.children.push(idCounter - 1);
          collection.push(parentNode);
        }
        collection.push(newNode);
        if(steps >= maxSteps || wordFound === true) {
          res.json(collection);
        }  
        else {
          depthCrawl(idCounter, steps, maxSteps, word, chosenUrl, collection, res);
        }
        
      }
    });
  }

  function createNode(id, url) {
    var newNode = {};
    newNode.id = id;
    newNode.url = url;
    newNode.children = [];
    return newNode;
  }

  function addChildren(nodes, children) {
    nodes.forEach(function(node) {
      children.forEach(function(child) {
        node.children.push(child.id);
      });
    });
  }
  
  function doesWordExist($, word) {
    var text = $('html > body').text().toLowerCase(); 
    word = word.toLowerCase(); 
    var exists = text.indexOf(word) !== -1; 
    return exists;
  }

}
