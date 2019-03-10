document.addEventListener("DOMContentLoaded", populateHistory);
document.addEventListener("DOMContentLoaded", main);

const MAP_WIDTH = 1500;
const MAP_HEIGHT = 1500;
const MAP_CENTER = {
  horiz: MAP_WIDTH / 2,
  vert: MAP_HEIGHT / 2,
};
const MAP_MARGIN = {
  left: MAP_WIDTH * .040,
  right: MAP_WIDTH * .040,
  top: MAP_HEIGHT * .047,
  bottom: MAP_HEIGHT * .047,
};


var canvas;

function main() {
  window.addEventListener("hashchange", () => {
    if(window.location.hash == "#test") { 
      d3.select("#test-data-btns").style("display", "block");
    }
  })

  canvas = initCanvas(canvas, "tree-canvas");
  initLeaflet(canvas, 0);


//  insertTestPoints(canvas);
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
