var blues = ["#f1eef6", "#d0d1e6", "#a6bddb", "#74a9cf", "#2b8cbe", "#045a8d", "#023858"];


function nestNode(data, lvl, parentId, tgtNode, lsts) {
  var node = {};
  var edge = {};

  node.branch = lvl;
  node.parent_id = parentId;
  node.node_id = tgtNode.id;
  node.url = tgtNode.url;
  node.fill = blues[lvl];
  node.fontColor = blues.slice(-1);
  if(lvl == 5) {
    node.fontColor = blues[0];
  }

  edge.source = parentId;
  edge.target = tgtNode.id;
  edge.branch = lvl;
  edge.stroke = blues[lvl];

  lsts.nodes.push(node)
  if(parentId != null) { 
    lsts.edges.push(edge)
  }

  var pId = tgtNode.id;
  lvl++;

  tgtNode.children = tgtNode.children.map( (i) => {
    var childNode = data.filter( (d) => {
      if(d.id == i) { return d; }
    })[0];
    
    return nestNode(data, lvl, pId, childNode, lsts)
  })

  return lsts
}


function buildTree(data) {
  
  var treeData = nestNode(data, 0, null, data[0], { nodes:[], edges:[] });
  console.log(treeData.edges)
  var radius = 45;

  var nodeData = treeData.nodes; 
  var edgeData = treeData.edges;

  var simulation = d3.forceSimulation()
    .nodes(nodeData);

  var forceEdge = d3.forceLink(edgeData)
    .id( (d) => { return d.node_id; })

  var forceCharge = d3.forceManyBody()
    .strength(-500)

  var forceCenter = d3.forceCenter( 
      canvas.dimension().width / 2, canvas.dimension().height / 2
    )

  var forceCollide = d3.forceCollide( radius * 1.1 )

  simulation
    .force("charge_force", forceCharge) 
    .force("center_force", forceCenter)
    .force("links", forceEdge)
    .force("collide", forceCollide)

  var nodeG = canvas.nodeG;
  var edgeG = canvas.edgeG;

  function clickNode(d)  {
    console.log(d); 
    window.open(d.url); 
  }

  var nodes = nodeG.selectAll(".node-circ")
    .data(nodeData)
    .enter()
    .append("circle")
    .attr("id", (d) => { return "node-circ-" + d.node_id })
    .attr("class", "node-circ")
    .attr("r", radius)
    .attr("fill", (d) => { return d.fill; }) 
    .on("click", clickNode);


  var texts1 = nodeG.selectAll(".node-text1")
    .data(nodeData)
    .enter()
    .append("text")
    .attr("id", (d) => { return "node-text1-" + d.node_id })
    .attr("class", "node-text node-text1")
    .attr("y", -15)
    .text( (d) => { return chopUrl(d).slice(0, 10); })
    .on("click", clickNode);

  var texts2 = nodeG.selectAll(".node-text2")
    .data(nodeData)
    .enter()
    .append("text")
    .attr("id", (d) => { return "node-text2-" + d.node_id })
    .attr("class", "node-text node-text2")
    .attr("y", 0)
    .text( (d) => { return chopUrl(d).slice(10, 21); })
    .on("click", clickNode);

  var texts3 = nodeG.selectAll(".node-text3")
    .data(nodeData)
    .enter()
    .append("text")
    .attr("id", (d) => { return "node-text3-" + d.node_id })
    .attr("class", "node-text node-text3")
    .attr("y", 15)
    .text( (d) => { return chopUrl(d).slice(21, 31); })
    .on("click", clickNode);

  nodeG.selectAll(".node-text1")
    .text( (d) => { return chopUrl(d).slice(0, 10); })
    .on("click", clickNode);

  nodeG.selectAll(".node-text2")
    .text( (d) => { return chopUrl(d).slice(10, 21); })
    .on("click", clickNode);

  nodeG.selectAll(".node-text3")
    .text( (d) => { return chopUrl(d).slice(21, 31); })
    .on("click", clickNode);

  nodeG.selectAll(".node-circ")
    .attr("fill", (d) => { return d.fill; }) 
    .attr("stroke-width", 2)
    .attr("stroke", blues.slice(-1))
    .on("click", clickNode)
    .on("click", clickNode);

  function chopUrl(d) {
    var url = d.url
      .replace("https", "")
      .replace("http", "")
      .replace("www.", "")
      .replace("://", "")
      .slice(0, 28);

    if(url.length <= 10) { url = "          " + url; }
 
    if(d.url.length > 28) { url += "..."; }
    return url;
  
  }




  var nodesExit = nodeG.selectAll(".node-circ")
    .data(nodeData)
    .exit()
    .remove()

  nodeG.selectAll(".node-text1")
    .data(nodeData)
    .exit()
    .remove()

  nodeG.selectAll(".node-text2")
    .data(nodeData)
    .exit()
    .remove()

  var edge = edgeG.selectAll("line")
    .data(edgeData)
    .enter()
    .append("line")
    .attr("stroke-width", 3)
    .attr("stroke", blues.slice(-1))

  edgeG.selectAll("line")
    .attr("stroke-width", 3)
    .attr("stroke", blues.slice(-1))
    
  var edgeExit = edgeG.selectAll("line")
    .data(edgeData)
    .exit()
    .remove()

  
  var onDrag = d3.drag()
    .on("start", (d) => {
      if(!d3.event.active) {
        simulation.alphaTarget(0.3)
          .restart();
      }
    })
    .on("drag", (d) => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }) 
    .on("end", (d) => {
      simulation.alphaTarget(0)
      d.fx = null;
      d.fy = null;
      
    })
  onDrag(nodes);



  simulation.on("tick", () => {
    // update node positions
    canvas.nodeG.selectAll("circle")
     .attr("transform", (d) => { 
      var x = d.x;  
      var y = d.y;
      return "translate(" + x + "," + y + ")";
    })
 
    canvas.nodeG.selectAll("text")
     .attr("transform", (d) => { 
      var x = d.x;  
      var y = d.y;
      return "translate(" + x + "," + y + ")";
    })
    canvas.nodeG.selectAll("text")
      .attr("fill", (d) => { return d.fontColor; });

    // update edge postions
    canvas.edgeG.selectAll("line")
      .attr("x1", (d) => { return d.source.x; })
      .attr("y1", (d) => { return d.source.y; })
      .attr("x2", (d) => { return d.target.x; })
      .attr("y2", (d) => { return d.target.y; })
  })

  

}
