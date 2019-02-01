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

  ajax.post("/login", payload, (res) => { console.log(res) });

}

function submitSearch() {
  var url = d3.select("#url-text").node().value;

  var steps = d3.select("#steps-int").node().value;

//hardcoded
var type = "depth";
  //var type = d3.select("#search-type").node().value;

  if(validateSearchInput(url, steps, type) == 1) {
    var payload = {
      url: url,
      word: "test",
      steps: steps,
      type: type,
    }

   var endPoint = "/crawl/" + type.toLowerCase();

   ajax.post(endPoint, payload, (res) => { console.log(res) });

  } else {
//need to finish validation
    console.log("not valid input");
  }

}

function seedSubmit() {
//hardcoded
var type = "breadth";
  //var type = d3.select("#search-type").node().value;

  var endPoint = "/seeds/" + type.toLowerCase();

  ajax.get(endPoint, (res) => {
    console.log(res)
  })
	
}


function validateSearchInput(url, steps, type) {
//need to write validation
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
