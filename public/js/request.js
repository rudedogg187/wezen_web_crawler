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
  var url = d3.select("#url-text");

  var steps = d3.select("#steps-int");

  var type = d3.select("#search-type");

  if(validateSearchInput(url, steps, type) == 1) {
    var payload = {
      url: url,
      steps: steps,
      type: type,
    }

    //ajax.post("/search", payload, (res) => { console.log(res) });

  } else {
//need to finish validation
    console.log("not valid input");
  }

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
}
