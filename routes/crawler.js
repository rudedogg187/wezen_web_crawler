module.exports = (app, cheerio, URL, bodyParser, syncReq, fs, db) => {
  app.get('/crawl/history', (req, res) => {
    if(req.user != null && req.user.userId != null) {
      var path = './logs/' + req.user.userId + '.txt';
      if(fs.existsSync(path)) {
        var data = readData(path);
        if(data.length > 25) {
          data = truncateData(data, 25);
        }
        res.json(data);
      }
      else {
        var data = [];
        res.json(data);
      }
    }
    else {
      if(fs.existsSync('./logs/general.txt')) {
        var data = readData('./logs/general.txt');
        if(data.length > 25) {
          data = truncateData(data, 25);
        }
        res.json(data);
      }
      else {
        var data = [];
        res.json(data);
      }
    }
  });

  function truncateData(data, size) {
    if(data.length <= size) {
      return data;
    }
    var i = data.length - 1;
    var collection = [];
    for(var j = 0; j < size; j++) {
      collection.push(data[i]);
      i--;
    }
    return collection;
  }

  function readData(path) {
    var lines = fs.readFileSync(path, 'utf-8')
      .split('\n')
      .filter(Boolean);
    var data = [];
    var index = 0;
    lines.forEach((line) => {
      if(line.startsWith('http')) {
        var newObj = {url: line.trim(), steps:'', idx:index++, type: ''};
        data.push(newObj);
      }
      else if(!line.startsWith('*')) {
        var newObj = data.pop();
        if(newObj.steps == '') { 
          newObj.steps = line.trim();
          data.push(newObj);
        }
        else {
          newObj.type = line.trim(); 
          data.push(newObj);
        }
      }
    });
    return data;
  }

  app.post('/crawl/depth', (req, res) => {
    var user = null;
    var firstUrl = req.body.url;
    var word = req.body.word;
    var steps = req.body.steps;
    if(firstUrl == null) {
      res.status(400); 
      res.send('Please provide starting url.');
    }
    if(steps == null || steps < 0) {
      res.status(400);
      res.send('Please provide positive number of steps.');
    }
    if(req.user != null && req.user.userId != null) {
      writeLog(firstUrl, steps, req.user.userId, 'Depth');
      user = req.user;
    }
    else {
      logGeneral(firstUrl, steps, 'Depth');
    }

    var collection = depthCrawl(steps, word, firstUrl); 
    db.updateHistory(user, firstUrl, steps, "Depth", collection);

    res.json(collection);
  });

  app.post('/crawl/breadth', (req, res) => {
    var firstUrl = req.body.url;
    var word = req.body.word;
    var steps = req.body.steps;
    if(firstUrl == null) {
      res.status(400); 
      res.send('Please provide starting url.');
    }
    if(steps == null || steps < 0) {
      res.status(400);
      res.send('Please provide positive number of steps.');
    }
    if(req.user != null && req.user.userId != null) {
      writeLog(firstUrl, steps, req.user.userId, 'Breadth');
    }
    else {
      logGeneral(firstUrl, steps, 'Breadth');
    }
    var collection = breadthCrawl(steps, word, firstUrl); 
    db.updateHistory(req.user, firstUrl, steps, "breadth", collection);
    res.json(collection);

  });

  function breadthCrawl(maxSteps, word, pageToCrawl) {
    var idCounter = 1;
    var steps = 0;
    var collection = []; 
    var parentNodes = [];
    var url = new URL(pageToCrawl); 
    var baseurl = url.protocol + "//" + url.hostname;
    var parentNode = createNode(idCounter++, pageToCrawl);
    collection.push(parentNode); 
    parentNodes.push(parentNode);
    var wordFound = false;
    while (steps < maxSteps && parentNodes != null && parentNodes.length > 0 && wordFound == false) {
        var returnArray = processParents(idCounter, word, parentNodes, collection);
        parentNodes = returnArray.newNodes;
        idCounter = returnArray.idCount;
        wordFound = returnArray.wordFound;
        steps++;
    }
    return collection;
  }

  function processParents(idCounter, word, parentNodes, collection) {
    var returnArray = {newNodes: [], wordFound: false, idCount: idCounter}; 
    parentNodes.forEach((parentEach) => {
      try {
        var url = new URL(parentEach.url);
        var baseurl = url.protocol + "//" + url.hostname;
        var response = syncReq('GET', parentEach.url);
        if(response.statusCode == 200) {
          var body = response.getBody(); 
          var $ = cheerio.load(body);
          if(word != null && doesWordExist($, word)) {
            returnArray.wordFound = true; 
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
          currentUrls.forEach((childUrl) => {
            parentEach.children.push(idCounter);
            var newNode = createNode(idCounter++, childUrl);
            returnArray.idCount++;
            collection.push(newNode);
            returnArray.newNodes.push(newNode);
          });
        }
      }
      catch (ex){
        console.log(ex);
      }

    });
    return returnArray;
  } 

  function depthCrawl(maxSteps, word, pageToCrawl) {
    var collection = [];
    var idCounter = 1; 
    var steps = 0;
    var currentUrls = []; 
    while(steps < maxSteps) {
      var url = new URL(pageToCrawl);
      var baseurl = url.protocol + "//" + url.hostname;
      var response = syncReq('GET', pageToCrawl);
      if(response.statusCode == 200) {
        if(collection != null && collection.length > 0) {
          var parentNode = collection.pop(); 
          parentNode.children.push(idCounter);
          collection.push(parentNode);
        }
        var newNode = createNode(idCounter++, pageToCrawl);
        collection.push(newNode); 
        var $ = cheerio.load(response.getBody());
        var wordFound = false;
        if(word != null && doesWordExist($, word)) {
          wordFound = true;
        }
        var anchorTags = $('a');
        currentUrls = [];
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
      }
      pageToCrawl = currentUrls[Math.floor(Math.random() * currentUrls.length)];
      steps++  
    }
    return collection;
  }

  function createNode(id, url) {
    var newNode = {};
    newNode.id = id;
    newNode.url = url;
    newNode.children = [];
    return newNode;
  }

  function doesWordExist($, word) {
    var text = $('html > body').text().toLowerCase(); 
    word = word.toLowerCase(); 
    var exists = text.indexOf(word) !== -1; 
    return exists;
  }

  function writeLog(firstUrl, steps, userId, type) {
    var text = '**\n' + firstUrl + '\n' + steps + '\n' + type + '\n';;
    var directory = './logs/';
    directory += userId + '.txt';
    fs.appendFile(directory, text, function(err) {
      if(err) {
        console.log(err);
      }
    });
  }

  function logGeneral(firstUrl, steps, type) {
    var text = '**\n' + firstUrl + '\n' + steps + '\n' + type + '\n';
    var directory = './logs/general.txt';
    fs.appendFile(directory, text, function(err) {
      if(err) {
        console.log(err);
      }
    });
  }

}
