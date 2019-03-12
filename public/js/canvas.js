

function initCanvas(canvasId, zoom) {
  canvas = {}
  var tag = "#" + canvasId;
  canvas.div = d3.select(tag);
  canvas.id = canvasId;
  canvas.dimension = getDimension;
  canvas.div.style("width", canvas.dimension().width)
  canvas.div.style("height", canvas.dimension().height)
  canvas.zoom = 0;

  canvas.legandG = d3.select(tag.replace("canvas", "legand"))
    .style("position", "absolute")
    .style("width", "300px")
    .style("height", "90%")
    .style("z-index", 10)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")

   


  canvas.base = L.map(canvas.id, {
    zoomControl: false, 
    crs: L.CRS.Simple,
    minZoom: -10,
    maxZoom: 20,
  });

  canvas.base.setView( [canvas.dimension().width / 2, canvas.dimension().height / 2], 0); 
  L.svg({
    clickable: true,
  }).addTo(canvas.base);


  canvas.overlay = d3.select(canvas.base.getPanes().overlayPane);
  canvas.svg = canvas.overlay.select("svg");
  canvas.g = canvas.svg.select("g");

  canvas.base.setZoom(canvas.zoom);
//  canvas.zoom = 0;

  canvas.overlay.style("pointer-events", "auto");
  canvas.svg.style("pointer-events", "auto");

  canvas.base.on("zoomend", zoomEnd);


  function zoomEnd() {

    var zoomLvl = +canvas.base.getZoom();
    var zoomChg = (zoomLvl - +canvas.zoom)

    var scaleLvl = +canvas.nodeG.attr("transform")
      .replace("scale(", "")
      .replace(")", "");

    scaleLvl = scaleLvl += (zoomChg * .5);

    canvas.zoom = zoomLvl;

    canvas.nodeG
      .attr("transform", "scale( " + scaleLvl + ")")
    canvas.edgeG
      .attr("transform", "scale( " + scaleLvl + ")")
  }

  canvas.g.append("rect")
    .attr("class", "canvas-back")
    .attr("fill", "#ffffff")
    .attr("fill-opacity", 0)
    .attr("width",  canvas.dimension().width)
    .attr("height", canvas.dimension().height)

 
  canvas.g.append("circle")
    .attr("class", "canvas-center")
    .attr("r", 3)
    .attr("fill-opacity", 0)
    .attr("cx",  canvas.dimension().width / 2)
    .attr("cy",  canvas.dimension().height / 2)
   
  canvas.edgeG = canvas.g.append("g")
    .attr("id", "all-edges")
    .attr("transform", "scale(1)");

  canvas.nodeG = canvas.g.append("g")
    .attr("id", "all-nodes")
    .attr("transform", "scale(1)");

  function getDimension() {
    var width = (+getComputedStyle(this.div.node()).width
      .replace("px", ""))

    this.div.style("height", "90%");

    var height = (+getComputedStyle(this.div.node()).height
      .replace("px", ""))

    return { width: width, height: height };
  }

  return canvas
}

