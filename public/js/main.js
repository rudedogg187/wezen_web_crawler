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

  canvas = initCanvas(canvas, "tree-canvas");
  initLeaflet(canvas, 0);


  d3.selectAll(".history-url")
    .on("mouseover", () => {
      var myId = d3.event.target.id;
      var me = d3.select("#" + myId);
      var d = JSON.parse(me.attr("data-d"));

      console.log(d);
    })
    .on("click", () => {
      var myId = d3.event.target.id;
      var me = d3.select("#" + myId);
      var d = JSON.parse(me.attr("data-d"));

      buildTree(d.collection);
    })

//  insertTestPoints(canvas);

  

}

