document.addEventListener("DOMContentLoaded", populateHistory);
document.addEventListener("DOMContentLoaded", main);

var canvas;

function main() {
//  d3.select("#test-data-btns").style("display", "block");
  window.addEventListener("hashchange", () => {
    if(window.location.hash == "#test") { 
      d3.select("#test-data-btns").style("display", "block");
    }
  })

  canvas = initCanvas("tree-canvas", 0);
}

function populateHistory() {
  var endPoint = '/crawl/history';
  ajax.get(endPoint, function(res) { 
    var nodeList = document.getElementsByClassName("history-url");
    for(var i = 0; i < nodeList.length; ++i) {
      nodeList[i].removeEventListener("click", populateForm);
    }
    var crawlData = document.getElementById('crawlData');
    crawlData.innerHTML = '';
    res.forEach((item, index) => {
      var node = document.createElement("div");
      node.textContent = item.url;
      node.setAttribute("id", "history-url-" + index);
      node.setAttribute("class", "history-url");
      node.setAttribute("data-d", JSON.stringify(item));
      var small = document.createElement("small");
      small.textContent = "  Steps: " + item.steps;
      node.appendChild(small);
      crawlData.appendChild(node);
    });
    var nodeList = document.getElementsByClassName("history-url");
    for(var i = 0; i < nodeList.length; ++i) {
      nodeList[i].addEventListener("click", populateForm);
    }
  });

}


function populateForm(item) {
  var d = JSON.parse(item["currentTarget"].getAttribute('data-d'));
  if(d != null && typeof d != undefined) {
    if(d.url != null && typeof d.url != undefined) {
      var urlText = document.getElementById("url-text");
      urlText.value = d.url;
    }
    if(d.steps != null && typeof d.steps != undefined) {
      var stepsForm = document.getElementById("steps-int");
      stepsForm.value = d.steps;
    }
    if(d.type != null && typeof d.type != undefined) {
      var searchType = document.getElementById("search-type");
      searchType.value = d.type;
    }
  }
}
