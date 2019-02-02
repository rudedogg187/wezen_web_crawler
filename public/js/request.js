document.addEventListener("DOMContentLoaded", main);

function createAccount() {
  var payload = {
    user: "testie",
    pwrd: "testerson",
  }

  ajax.post("/create", payload, (res) => { console.log(res) });

}


function accountLogon() {
  var payload = {
    user: "testie",
    pwrd: "testerson",
  }

  ajax.post("/login", payload, (res) => { 
    var loginBtn = d3.select("#login-btn")

    loginBtn.html("Log Off");    

    var link = d3.select("#hist-main")
      .selectAll(".hist-link")
      .data(res.history);

    link.enter()
      .append("div")
      .attr("class", "hist-link")
      .html( (d) => { return d.url; });
	

  });

}

function submitSearch() {
  var url = d3.select("#url-text").node().value;
  var word = d3.select("#key-word").node().value;
  var steps = d3.select("#steps-int").node().value;
  var type = d3.select("#search-type").node().value;

  if(validateSearchInput(url, steps) == 1) {
    var payload = {
      url: url,
      word: word,
      steps: steps,
      type: type,
    }

    var endPoint = "/crawl/" + type.toLowerCase();

    console.log(payload);
    ajax.post(endPoint, payload, (res) => { 
      buildTree(res);
    })


  } else {
    console.log("not valid input");
  }

}

function seedSubmit() {
//hardcoded
var type = "breadth";
  //var type = d3.select("#search-type").node().value;

  var endPoint = "/seeds/" + type.toLowerCase();

  ajax.get(endPoint, (res) => {
    buildTree(res);
  })
	
}


function validateSearchInput(url, steps) {
//need to write validation
  if(!(+steps === parseInt(+steps, 10))) {
    console.log("bad steps");
    return 0;
  }
  if(+url === parseInt(+url, 10)) {
    console.log("bad url");
    return 0;
  }


  return 1;
}



function main() {
  var loginBtn = d3.select("#login-btn")
    .on("click", accountLogon);

  var createBtn = d3.select("#create-btn")
    .on("click", createAccount);

  var submitBtn = d3.select("#search-submit-btn")
    .on("click", submitSearch);

  var seedBtn = d3.select("#seed-submit-btn")
    .on("click", seedSubmit);
}
