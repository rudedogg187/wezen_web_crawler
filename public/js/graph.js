
function updateRect() {
  var data = [
    { x: 145, y: 175 },
    { x: 155, y: 175 },
  ];

  canvas.g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => { return d.x; })
    .attr("y", (d) => { return d.y; })
    .attr("width", 9)
    .attr("height", 9)
    

}
var I = 0;
function nestNode(data, lvl, parentId, tgtNode) {
//console.log("I", I)
	//console.log("tgtNode", tgtNode)
	var nested = {};	

	nested.branch = lvl;
	nested.parent_id = parentId;
	nested.node_id = tgtNode.id;
	nested.url = tgtNode.url;
	nested.I = I++;

	var pId = tgtNode.id;
	lvl++;
	nested.children = tgtNode.children.map( (i) => {
		var childNode = data.filter( (d) => {
			if(d.id == i) { return d; }
		})[0];
		//console.log("cn", childNode)
		return nestNode(data, lvl, pId, childNode)
	})

	//console.log("nested", JSON.stringify(nested));

	return nested	
}

function buildTreex(data) {
  var treeData = nestNode(data, 0, null, data[0]);
  console.log(treeData)

  var regR = 15;
  var bigW = 155;
  var bigH = 75;
  var dur = 500;

  var width = canvas.dimension().width;
  var height = canvas.dimension().height;

  var treemap = d3.tree()
    .size([width, height]);

  var root = d3.hierarchy(treeData, (d) => {
    return d.children;
  })

  root.x0 = height / 2;
  root.y0 = 0;

  console.log(height,root)
  update(root);

  function update(source) {
    var treeData = treemap(root);

    var nodes = treeData.descendants();

    var edges = treeData.descendants()
      .slice(1);

    nodes.forEach( (d) => {
      d.y = d.depth * 180 ;
    });

    var edge = canvas.g.selectAll(".edge")
      .data(edges, (d, i) => { 
        return d.data.node_id;
      })

    var edgeEnter = edge.enter()
      .insert("path", "g")
      .attr("class", "edge")
      .attr("id", (d) => {
        return "edge-" + d.data.parent_id + "-" + d.data.node_id;
      })
      .attr("d", (d) => {
        //var o = { x: source.x0 *.5, y: source.y0}
        //var o = { x: d.x, y: d.y}
        return curvePath(source, source)
        //return curvePath(o, o);
      })
     .attr("stroke", "black")

    var edgeUpdate = edgeEnter.merge(edge);

    edgeUpdate.transition()
      .duration(dur)
      .attr("d", (d) => {
        return curvePath(d, d.parent)
      });

    edgeExit = edge.exit()
      .remove()

    var node = canvas.g.selectAll(".node-g")
      .data(nodes, (d, i) => {
        return i//d.data.node_id;
      })

		var nodeEnter = node.enter()
			.append("g")
			.attr("class", "node-g")
			.attr("id", (d, i) => {
				return "node-g-" + i;
			})
			.attr("transform", (d, i) => {
				var x = source.x * .5//d.x * .5;
				var y = source.y + 20 //d.y + 20;
				//source.y0 source.x0
	//			return "translate(" + y + "," + x + ")"
				return "translate(" + 0 + "," + 0 + ")"
			})


  }




}


function curvePathX(s, d) {
  return `M ${s.y + 20} ${s.x * .5}
  C ${(s.y + 20 + d.y + 20) / 2} ${s.x * .5},
  ${(s.y + 20 + d.y + 20) / 2} ${d.x * .5},
  ${d.y + 20 } ${d.x * .5}`

}

function buildTree(data) {
  var treeData = nestNode(data, 0, null, data[0]);
  //console.log(treeData)

  var regR = 15;
  var bigW = 155;
  var bigH = 75;
  var dur = 500;

  var width = canvas.dimension().width;
  var height = canvas.dimension().height;

  var treemap = d3.tree()
    .size([width, height]);
	
  var root = d3.hierarchy(treeData, (d) => {
    return d.children;
  })

  root.x0 = 0; //MAP_CENTER.horiz;
  root.y0 = 0;

  console.log("root:", root)
  update(root);

  function update(source) {
    console.log("source.data:", source.data)
    var treeData = treemap(root);
    var nodes = treeData.descendants();

    var edges = treeData.descendants()
      .slice(1);

    nodes.forEach( (d) => {
      d.y = d.depth * 180 ;
    });
/*************************************************EDGE UPDATE*******************************************************/
    var edge = canvas.g.selectAll(".edge")
      .data(edges, (d, i) => { 
        return d.data.node_id;
      })

    var edgeEnter = edge.enter()
      .insert("path", "g")
      .attr("class", "edge")
      .attr("id", (d) => {
        return "edge-" + d.data.parent_id + "-" + d.data.node_id;
      }) /*
      .attr("d", (d) => {
        return curvePath(source, source)
      })
      .attr("stroke", "black")
*/
      var edgeUpdate = edgeEnter.merge(edge);

      edgeUpdate.transition()
        .duration(dur)
        .attr("d", (d) => {
          return curvePath(d, d.parent)
        })
        .attr("stroke-width", graphAttribute().edgeStrokeWidth)

      edgeExit = edge.exit()
       .remove()
/**************************************************EDGE UPDATE************************************************************/	

    // create a svg g for each node
    var node = canvas.g.selectAll(".node-g")
      .data(nodes, (d, i) => {
        return i//d.data.node_id;
      })

    /*** ENTERING NEW NODE G ***/
    // handle new node data entering canvas
    var nodeEnter = node.enter()
      .append("g")
      .attr("class", "node-g")
      .attr("id", (d, i) => {
        return "node-g-" + i;
      })
      .attr("transform", nodeTranslate)
      .on("click", (d) => { 
        console.log(d.data); 
        window.open(d.data.url); 
      })


    /*** ENTERING NEW CIRCLE ***/
    // append a new "circle" to g when new data enters (actually a rectangle that looks like a circle)
    var nodeCirc = nodeEnter.append("rect")
      .attr("class", (d) => {
        return "node node-id-" + d.data.node_id;
      })
      .attr("id", (d, i) => { return "node-" + i })
      .attr("width", 1)
      .attr("height", 1)
      .on("mouseover", nodeHoverOver)
      .on("mouseout", nodeHoverOut)

    /*** ENTERING NEW TEXT ***/
    // append a new text element to g when new data enters
    var nodeText = nodeEnter.append("text")
      .attr("class", "node-text")
      .attr("id", (d, i) => { return "node-text-" + i; })
   //   .text( (d) => { 
   //     return d.data.I; //d.data.node_id; 
   //   })


/******************* ENTERING NEW DETAIL TEXT NEEDS FIXED ****************************/
    // append a new text detail to g when data enters
    var nodeDetail = nodeEnter.selectAll(".detail-text")
      .data( (d) => { 
        var mom = data.filter( (f) => {
          if(f.id == d.data.parent_id) { 
            return f; 
          }
        })
        if( mom.length > 0 ) { 
          mom = mom[0]; 
        } else {
          mom = { url: null, id: null, children: [] };
        }

        var sis = mom.children.filter( (f) => {
          if(f != d.data.node_id) { 
            return f; 
          }
        })

        return [
          { id: d.data.node_id, text: d.data.url },
          { id: d.data.node_id, text: "Child Count: " + d.data.children.length },
          { id: d.data.node_id, text: "Sibling Count: " + sis.length },
        ] 
    });

    nodeDetail.enter()
      .append("text")
      .attr("class", (d) => { return "detail-text detail-text-" + d.id })
      .attr("y", (d, i) => { return -16 + i * 20; })
      .attr("x", -4)
      .style("fill-opacity", 0)
      .text( (d) => { 
        return d.text; 
      })

    nodeDetail.merge(nodeDetail)

    nodeDetail.exit()
      .remove()
/********** NODE DETAILS THIS NEEDS FIXED *************************/

    /*** UPDATING EXITING NODE G ***/
    // handle exisiting node data on canvas
    nodeUpdate = nodeEnter.merge(node);

    // node transition
    nodeUpdate.transition()
      .duration(dur)
      .attr("transform", nodeTranslate);

    // handle exisiting node circles data on canvas
    nodeUpdate.select(".node")
      .transition()
      .duration(dur)
      .attr("stroke-width", graphAttribute().nodeStrokeWidth)
      //.attr("r", regR)
      .attr("width", graphAttribute().nodeRadius * 2 )
      .attr("height", graphAttribute().nodeRadius * 2 )
      .attr("rx", graphAttribute().nodeRadius)
      .attr("ry", graphAttribute().nodeRadius)
      .attr("transform", "translate(" + -graphAttribute().nodeRadius + ", " + -graphAttribute().nodeRadius + ")");

    // handle exisiting node text data on canvas
    nodeUpdate.select(".node-text")
      .text( (d) => { return graphAttribute(d).nodeText;} )


    // handle exiting node data
    nodeExit = node.exit()
      .remove()
  }


	function nodeHoverOver(d, i) {


		var me = d3.select("#node-" + i);
		var myText = d3.select("#node-text-" + i);
		var myMom = d3.selectAll(".node-id-" + d.data.parent_id);
		var myEdge = d3.select("#edge-" + d.data.parent_id + "-" + d.data.node_id);
		var myDetail = d3.selectAll(".detail-text-" + d.data.node_id)

		d.data._p = {
			edge_stroke_width: myEdge.style("stroke-width"),
			mom_fill: myMom.style("fill"),
		}

		myEdge.style("stroke-width", graphAttribute().edgeStrokeWidth)
		myMom.style("fill", "yellow")
		me.transition()
			.duration(dur)
			.attr("width", bigW)
			.attr("height", bigH)
			.attr("rx", regR / 4)
			.attr("ry", regR / 4)
			.attr("transform", "translate(" + -regR + ", " + -(bigH / 2) + ")");

		myText.transition()
			.duration(dur / 2)
			.style("fill-opacity", 0)

		myDetail.transition()
			.delay(dur / 2 )
			.duration(dur / 2)
			.style("fill-opacity", 1)
	}

	function nodeHoverOut(d, i) {
		var me = d3.select("#node-" + i);
		var myText = d3.select("#node-text-" + i);
		var myMom = d3.selectAll(".node-id-" + d.data.parent_id);
		var myEdge = d3.select("#edge-" + d.data.parent_id + "-" + d.data.node_id);
		var myDetail = d3.selectAll(".detail-text-" + d.data.node_id)

		myEdge.style("stroke-width", d.data._p.edge_stroke_width)
		myMom.style("fill", d.data._p.mom_fill)

		me.transition()
			.duration(dur)
      			.attr("width", graphAttribute().nodeRadius * 2 )
      			.attr("height", graphAttribute().nodeRadius * 2 )
      			.attr("rx", graphAttribute().nodeRadius)
      			.attr("ry", graphAttribute().nodeRadius)
       			.attr("transform", "translate(" + -graphAttribute().nodeRadius + ", " + -graphAttribute().nodeRadius + ")");

		myText.transition()
			.delay(dur / 2 )
			.duration(dur / 2)
			.style("fill-opacity", 1)

		myDetail.transition()
			.delay(dur / 2 )
			.style("fill-opacity", 0)
	}
/*
	function curvePath(s, d) {
		return `M ${s.y + 20} ${s.x * .5}
			C ${(s.y + 20 + d.y + 20) / 2} ${s.x * .5},
			  ${(s.y + 20 + d.y + 20) / 2} ${d.x * .5},
			  ${d.y + 20 } ${d.x * .5}`

	}
*/
}




function nodeTranslate(d, i) {
  var x = d.x //* .5;
  var y = d.y + 150//+ 20;
  var rootLatLng = new L.LatLng(0, 0);
  var margLatLng = new L.LatLng(MAP_MARGIN.left, MAP_MARGIN.bottom);
  var latLng = new L.LatLng(x, y);
  var xy = canvas.base.latLngToLayerPoint(latLng);
  var centY = canvas.getXY.center().y;
  var rootY = canvas.base.latLngToLayerPoint(rootLatLng).y;
  var marg = canvas.base.latLngToLayerPoint(margLatLng);
    
/*
	console.log("ry:", rootY);
	console.log("cy:", centY);
	console.log("mg:", marg);  */
  var offsetY = ((centY - rootY) / 2) - (canvas.getMargin().bottom *.35675)


  return "translate(" + xy.x + "," + (xy.y + offsetY) + ")" 
}

function curvePath(s, d) {
  var rootLatLng = new L.LatLng(0, 0);
  var margLatLng = new L.LatLng(MAP_MARGIN.left, MAP_MARGIN.bottom);
  var centY = canvas.getXY.center().y;
  var rootY = canvas.base.latLngToLayerPoint(rootLatLng).y;
  var marg = canvas.base.latLngToLayerPoint(margLatLng);
  var offsetY = ((centY - rootY) / 2) - (canvas.getMargin().bottom *.35675)

  var dx = d.x //* .5;
  var dy = d.y + 150//+ 20;
  var dLatLng = new L.LatLng(dx, dy);
  var dxy = canvas.base.latLngToLayerPoint(dLatLng);

  var sx = s.x //* .5;
  var sy = s.y + 150//+ 20;
  var sLatLng = new L.LatLng(sx, sy);
  var sxy = canvas.base.latLngToLayerPoint(sLatLng);

  dx = dxy.x;
  dy = dxy.y + offsetY;

  sx = sxy.x;
  sy = sxy.y + offsetY;

  return `
    M ${sx} ${sy}
    L ${dx} ${dy}
  `
/*
  return `
    M ${a1} ${a2}
    C ${b1} ${b2},
      ${c1} ${c2},
      ${d1} ${d2}
  `
*/
}


function translateEdge() {
  var dur = 50;
  d3.selectAll(".edge")
    .attr("d", (d) => {
       return curvePath(d, d.parent)
    });
 
}


function graphAttribute(d) {
  var m = 1;
  var z = -3;
  while(z < canvas.base.getZoom()) { 
    z ++
    m *= 2;
  }

  var esw = m * 1.75;
  var nsw = m * .75;
  var nfs = m * 7.5;
  var nr = m * 7.5;
  var nt = null;
  
  if(d) {
    nt = d.data.I + ": " + canvas.base.getZoom();
//    if(canvas.base.getZoom() > -1) {
 //     nt = d.data.url;
  //  }
  }
  
  return {
    edgeStrokeWidth: esw,
    nodeStrokeWidth: nsw,
    nodeRadius: nr,
    nodeFontSize: nfs,
    nodeText: nt,
  }
}


function getNodeRadius() {
  var m = 1;
  var z = -3;
  while(z < canvas.base.getZoom()) { 
    z ++
    m *= 2;
  }

  var r = m * 7.5;
  return r;
}



function scaleNode() {
  var nr = graphAttribute().nodeRadius;
  var nsw = graphAttribute().nodeStrokeWidth;
  var esw = graphAttribute().edgeStrokeWidth;
  var fs = graphAttribute().nodeFontSize;
  
  var dur = 0;
  d3.selectAll(".node")
    .transition()
    .duration(dur)
      .style("stroke-width", nsw)
      .attr("width", nr * 2)
      .attr("height", nr * 2)
      .attr("rx", nr)
      .attr("ry", nr)
      .attr("transform", "translate(" + -nr + ", " + -nr + ")"); 

  d3.selectAll(".edge")
    .transition()
    .duration(dur)
      .style("stroke-width", esw)

  d3.selectAll(".node-text")
    .transition()
    .duration(dur)
    .style("font-size", fs + "px")
    .text( (d) => { return graphAttribute(d).nodeText;} )

}


function translateNode() {
  var dur = 0;
  d3.selectAll(".node-g")
    .transition()
    .duration(dur)
    .attr("transform", nodeTranslate) 
}

