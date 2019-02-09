document.addEventListener("DOMContentLoaded", main);
var canvas = {};


function getCanvasBounds() {
	var y = canvas.cont.node().getBoundingClientRect().y;
	var h = screen.height;

	canvas.bounds = {
		width: .95 * canvas.cont.node().getBoundingClientRect().width,
		height: (h - y) * 2,
	}
}


function addCanvas(cont) {
	canvas.cont = d3.select(cont);

	getCanvasBounds(canvas);

	canvas.svg = canvas.cont.append("svg")
		.attr("width", canvas.bounds.width)
		.attr("height", canvas.bounds.height)

	canvas.g = canvas.svg.append("g");

	canvas.artboard = canvas.g.append("rect")
		.attr("class", "artboard")
		.attr("width", canvas.bounds.width)
		.attr("height", canvas.bounds.height)

	canvas.defs = canvas.svg.append("defs");

}


function nestNode(data, lvl, parentId, tgtNode) {
	//console.log("tgtNode", tgtNode)
	var nested = {};	

	nested.branch = lvl;
	nested.parent_id = parentId;
	nested.node_id = tgtNode.id;
	nested.url = tgtNode.url;

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


function buildTree(data) {
	var treeData = nestNode(data, 0, null, data[0]);
	console.log(treeData)

	var regR = 15;
	var bigW = 155;
	var bigH = 75;
	var dur = 500;

	var width = canvas.bounds.width;
	var height = canvas.bounds.height;

	var treemap = d3.tree()
		.size([width, height]);

	
	var root = d3.hierarchy(treeData, (d) => {
		return d.children;
	})

	root.x0 = height / 2;
	root.y0 = 0;

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
				return "translate(" + y + "," + x + ")"
			})
			.on("click", (d) => { 
				console.log(d.data); 
				window.open(d.data.url); 
			})


		var nodeCirc = nodeEnter.append("rect")
			.attr("class", (d) => {
				return "node node-id-" + d.data.node_id;
			})
			.attr("id", (d, i) => { return "node-" + i })
			.attr("width", 1)
			.attr("height", 1)
			.on("mouseover", nodeHoverOver)
			.on("mouseout", nodeHoverOut)


		var nodeText = nodeEnter.append("text")
			.attr("class", "node-text")
			.attr("id", (d, i) => { return "node-text-" + i; })
			.text( (d) => { return d.data.node_id; })


		var nodeDetail = nodeEnter.selectAll(".detail-text")
			.data( (d) => { 
				var mom = data.filter( (f) => {
					if(f.id == d.data.parent_id) { return f; }
				})
				if( mom.length > 0 ) { 
					mom = mom[0]; 
				}
				else { 
					mom = { url: null, id: null, children: [] };
				}

				var sis = mom.children.filter( (f) => {
					if(f != d.data.node_id) { return f; }
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
			.text( (d) => { return d.text; })
			

		nodeDetail.merge(nodeDetail)

		nodeDetail.exit()
			.remove()

		nodeUpdate = nodeEnter.merge(node);

		nodeUpdate.transition()
			.duration(dur)
			.attr("transform", (d, i) => {
				var x = d.x * .5;
				var y = d.y + 20;
				return "translate(" + y + "," + x + ")"
			})
		
		nodeUpdate.select(".node")
			.transition()
			.duration(dur)
			//.attr("r", regR)
			.attr("width", regR * 2)
			.attr("height", regR * 2)
			.attr("rx", regR)
			.attr("ry", regR)
			.attr("transform", "translate(" + -regR + ", " + -regR + ")");

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

		myEdge.style("stroke-width", 10)
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
			.attr("width", regR * 2)
			.attr("height", regR * 2)
			.attr("rx", regR)
			.attr("ry", regR)
			//.attr("r", regR)
			.attr("transform", "translate(" + -regR + ", " + -regR + ")");

		myText.transition()
			.delay(dur / 2 )
			.duration(dur / 2)
			.style("fill-opacity", 1)

		myDetail.transition()
			.delay(dur / 2 )
			.style("fill-opacity", 0)
	}

	function curvePath(s, d) {
		return `M ${s.y + 20} ${s.x * .5}
			C ${(s.y + 20 + d.y + 20) / 2} ${s.x * .5},
			  ${(s.y + 20 + d.y + 20) / 2} ${d.x * .5},
			  ${d.y + 20 } ${d.x * .5}`

	}



	
	
	

}


function main() {
	addCanvas("#tree-canvas");
	console.log(canvas);
//	seedSubmit();
	

}
