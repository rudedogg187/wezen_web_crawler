


function initCanvas(canvas, canvasId) {
  var canvas = {};
  var tag = "#" + canvasId;
  canvas.div = d3.select(tag);
  canvas.id = canvasId;
  canvas.dimension = getDimension;
  canvas.resize = resizeCanvas;

  function getDimension() {
//**needed** add function to get dim of window size change here
    var width = 700;
    var height = 400;
    return { width: width, height: height };
  
  }

  function resizeCanvas() {
    this.div.style("min-width", this.dimension().width + "px")
    this.div.style("min-height", this.dimension().height + "px")
    this.div.style("max-width", this.dimension().width + "px")
    this.div.style("max-height", this.dimension().height + "px")
  }

  canvas.resize();
  return canvas
}

function initLeaflet(canvas, zoom) {
//**CHECK

  canvas.bounds = [[0, 0], [MAP_WIDTH, MAP_WIDTH]]
  canvas.base = L.map(canvas.id, {
    zoomControl: false, 
    crs: L.CRS.Simple,
    minZoom: -3,
    maxZoom: 10,
  });


//**CHECK

  canvas.base.setView( [MAP_WIDTH / 2, MAP_WIDTH / 2], 0); 
  canvas.base.fitBounds(canvas.bounds);
  canvas.tiles = addTiles()
  canvas.activeTile = -1;
  canvas.renderTile = renderTile;
  canvas.base.on("zoomend", zoomEnd);

  L.svg({
    clickable: true,
  }).addTo(canvas.base);

  canvas.overlay = d3.select(canvas.base.getPanes().overlayPane);
  canvas.svg = canvas.overlay.select("svg");
  canvas.g = canvas.svg.select("g");

  canvas.overlay.style("pointer-events", "auto");
  canvas.svg.style("pointer-events", "auto");
  canvas.getXY = {
    center: getCenter,
    northWest: getNorthWest,
    southWest: getSouthWest,
    southEast: getSouthEast,
    northEast: getNorthEast,
  };

  canvas.renderTile();

  function addTiles() {
    tiles = [];
    var tileLst = [
      { url: "/img/background-0.png", bounds: [[0, 0], [MAP_WIDTH, MAP_HEIGHT]] },
      { url: "/img/background-1.png", bounds: [[-25, -25], [1500, 1500]] },
      { url: "/img/background-2.png", bounds: [[-25, -25], [1500, 1500]] },
      { url: "/img/background-3.png", bounds: [[-25, -25], [1500, 1500]] },
    ]; 

    for(var i = 0; i < tileLst.length; i++) {
      var tile = tileLst[i];

      var l = L.imageOverlay(tile.url, tile.bounds)
        .addTo(canvas.base);

      var id = "background-image-" + i;

      tileLst[i].id = id; //l._leaflet_id;
      tileLst[i].leafletId = l._leaflet_id

      d3.selectAll(".leaflet-image-layer")._groups[0].forEach( (layer) => {
        if(layer.id == "") { 
          layer.id = id; 
          //var tile = d3.select("#" + id).style("display", "none")
          var tile = d3.select("#" + id).style("visibility", "hidden")
          tiles.push(tile)
	}
      })
    };
    
    return tiles;
  }

  function renderTile() {
    var zoomLevel = this.base.getZoom();
    var layerId;
    var levels = [4, 6, 8];

    if(zoomLevel <= levels[0]) {
        layerId = 0
    } else if (zoomLevel <= levels[1]) {
        layerId = 1;
    } else if (zoomLevel <= levels[2]) {
        layerId = 2;
    } else {
        layerId = 3;
    }

    if(this.activeTile != layerId) {
  
      d3.select("#background-image-" + this.activeTile)
        //.style("display", "none");
        .style("visibility", "hidden");

      this.activeTile = layerId;

      d3.select("#background-image-" + this.activeTile)
       // .style("display", null);
        .style("visibility", null);

    }
 //   console.log("zoom:", zoomLevel)
 //   console.log("tile:", this.activeTile) 

  }

  function getCenter() {
      var y = MAP_CENTER.horiz;
      var x = MAP_CENTER.vert;
      var latLng = new L.LatLng(y, x);
      var pt = canvas.base.latLngToLayerPoint(latLng);
      var cntr = { x: pt.x, y: pt.y };
      //console.log(cntr)
      return cntr;
  }

  function getNorthWest() {
      var y = MAP_WIDTH;
      var x = 0;
      var latLng = new L.LatLng(y, x);
      var pt = canvas.base.latLngToLayerPoint(latLng);
      var nw = { x: pt.x, y: pt.y };
      //console.log(nw)
      return nw;
  }

  function getSouthWest() {
      var y = 0;
      var x = 0;
      var latLng = new L.LatLng(y, x);
      var pt = canvas.base.latLngToLayerPoint(latLng);
      var sw = { x: pt.x, y: pt.y };
      //console.log(sw)
      return sw;
  }

  function getSouthEast() {
      var y = 0;
      var x = MAP_WIDTH;
      var latLng = new L.LatLng(y, x);
      var pt = canvas.base.latLngToLayerPoint(latLng);
      var se = { x: pt.x, y: pt.y };
      //console.log(se)
      return se;
  }

  function getNorthEast() {
      var y = MAP_HEIGHT;
      var x = MAP_WIDTH;
      var latLng = new L.LatLng(y, x);
      var pt = canvas.base.latLngToLayerPoint(latLng);
      var ne = { x: pt.x, y: pt.y };
      //console.log(ne)
      return ne;
  }

  function zoomEnd() {
    //alert(canvas.base.getPixelOrigin())

    console.log("c", canvas.getXY.center().y)
    console.log("s", canvas.getXY.southWest().y)

    canvas.renderTile();
    insertTestPoints(canvas);
    translateNode();
  } 

  canvas.base.setZoom(zoom);
}




function insertTestPoints(canvas) {
  //[y, x]
  var pointLst = [
//    [0, 0], [50, 25], [100, 50], [150, 75],
    [MAP_MARGIN.bottom, MAP_MARGIN.left] ,  //bottom left
    [MAP_CENTER.horiz, MAP_MARGIN.left] ,  //center left
    [(MAP_CENTER.horiz) * 2 - MAP_MARGIN.top, MAP_MARGIN.left], //top left
//    [382, 125],
//   [1000, 1000]
  ];
/*
  pointLst.forEach( (pt) => {
    pt = L.latLng(pt);
    console.log("pt", pt)
    L.marker(pt).addTo(canvas.base);

  })
*/
  var points = canvas.g.selectAll(".point")
    .data(pointLst);

  var pointsEnter = points.enter()
    .append("circle")
    .attr("class", "point")
    .attr("fill", (d, i) => {if(i == pointLst.length -1) { return "red"; }; return "#aaa"; })
    .attr("r", 5)
    .merge(points)
    .attr("cx", (d, i) => {
      var x = d[1];
      var y = d[0];
      var latLng = new L.LatLng(y, x);
      return canvas.base.latLngToLayerPoint(latLng).x;
    })
    .attr("cy", (d, i) => {
      var x = d[1];
      var y = d[0];
      var latLng = new L.LatLng(y, x);
      return canvas.base.latLngToLayerPoint(latLng).y;

    })

}

