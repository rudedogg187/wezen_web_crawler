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
  var errorMessages = validateSearchInput(url, steps);
  if(errorMessages == null || errorMessages.length == 0) {
    var payload = {
      url: url,
      word: word,
      steps: steps,
      type: type,
    }

    var endPoint = "/crawl/" + type.toLowerCase();
    var submitBtn = document.getElementById("search-submit-btn");
    submitBtn.disabled = true; 
    submitBtn.removeEventListener('click', submitSearch);
    submitBtn.innerText = 'Crawling';
    toastr.options = {
      closeButton: true, 
      debug: false, 
      newestOnTop: false,
      progressBar: false, 
      positionClass: "toast-top-full-width",
      preventDuplicates: true,
      timeOut: 0,
      extendedTimeOut: 50,
      tapToDismiss: true, 
    }
    toastr["info"]("Graph will populate shortly", "Crawl Started");
    console.log(payload);
    ajax.post(endPoint, payload, (res) => { 
      buildTree(res);
      toastr.clear();
      submitBtn.disabled = false;
      submitBtn.addEventListener('click', submitSearch);
      submitBtn.innerText = 'Crawl';
    })


  } else {
    toastr.options = {
      timeOut: 0,
      extendedTimeOut: 100,
      tapToDismiss: true, 
      debug: false,
      fadeOut: 10,
      positionClass: "toast-top-center"
    };
    errorMessages.forEach((err) => {
      toastr.error(err);
    });
  }

}

function dSeedSubmit() {
//hardcoded
var type = "depth";

  var endPoint = "/seeds/" + type.toLowerCase();

  ajax.get(endPoint, (res) => {
    buildTree(res);
  })
	
}

function bSeedSubmit() {
//hardcoded
var type = "breadth";
  //var type = d3.select("#search-type").node().value;

  var endPoint = "/seeds/" + type.toLowerCase();

  ajax.get(endPoint, (res) => {
    buildTree(res);
  })
	
}


function validateSearchInput(url, steps) {
  var stepsInt = parseInt(steps); 
  var errors = [];
  if(steps == null || steps == '' || stepsInt <= 0 || stepsInt > 5) {
    errors.push('Invalid Steps');
  }
  if(url == null || !isValidUrl(url)) {
    errors.push('Invalid Url');
  }
  return errors;

}

function isValidUrl(url) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
}

function main() {
  var loginBtn = d3.select("#login-btn")
    .on("click", accountLogon);

  var createBtn = d3.select("#create-btn")
    .on("click", createAccount);

  var submitBtn = d3.select("#search-submit-btn")
    .on("click", submitSearch);

  var dSeedBtn = d3.select("#d-seed-submit-btn")
    .on("click", dSeedSubmit);

  var bSeedBtn = d3.select("#b-seed-submit-btn")
    .on("click", bSeedSubmit);
}
