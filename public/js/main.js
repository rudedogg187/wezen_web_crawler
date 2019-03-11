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

