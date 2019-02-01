document.addEventListener("DOMContentLoaded", main);

function createAccount() {
  var payload = {
    user: "testie",
    pwrd: "testerson",
  }

  ajax.post("/create", payload, (res) => { console.log(res) });

}


function logon() {
  var payload = {
    user: "testie",
    pwrd: "testerson",
  }

  ajax.post("/login", payload, (res) => { console.log(res) });

}


function main() {
  var loginBtn = d3.select("#login-btn")
    .on("click", logon);


  var createBtn = d3.select("#create-btn")
   .on("click", createAccount);
}
