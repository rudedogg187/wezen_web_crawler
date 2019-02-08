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
	var bigR = 50;

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
			.attr("d", (d) => {
				//var o = { x: source.x0 *.5, y: source.y0}
				//var o = { x: d.x, y: d.y}
				return curvePath(source, source)
				//return curvePath(o, o);
			})
			.attr("stroke", "black")

		var edgeUpdate = edgeEnter.merge(edge);

		edgeUpdate.transition()
			.duration(1000)
			.attr("d", (d) => {
				return curvePath(d, d.parent)
			});


		edgeExit = edge.exit()
			.remove()
	

		var node = canvas.g.selectAll(".node-g")
			.data(nodes, (d, i) => {
				return d.data.node_id;
			})

		var nodeEnter = node.enter()
			.append("g")
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
				alert(d.data.url); 
			})

		nodeEnter.append("rect")
			.attr("class", "node")
			.attr("id", (d, i) => { return "node-" + i })
			.attr("width", 2)
			.attr("height", 2)
			.on("mouseover", (d, i) => {
				var me = d3.select("#node-" + i);
				me.transition()
					.duration(1000)
					.attr("width", bigR)
					.attr("transform", "translate(" + (bigR - regR) + ", " + 0 + ")");

			})


	

/*
		nodeEnter.append("circle")
			.attr("class", "node")
			.attr("id", (d, i) => { return "node-" + i })
			.attr("r", 2)
			.on("mouseover", (d, i) => {
				var me = d3.select("#node-" + i);
				
				me.transition()
					.duration(1000)
					.attr("r", bigR)
					.attr("transform", "translate(" + (bigR - regR) + ", " + 0 + ")");

			})
			.on("mouseout", (d, i) => {
				var me = d3.select("#node-" + i);

				me.transition()
					.duration(1000)
					.attr("r", regR)
					.attr("transform", "translate(" + 0  + ", " + 0 + ")");

			})

*/
		nodeEnter.append("text")
			.attr("class", "node-text")
			.text( (d) => { return d.data.node_id; })

		nodeUpdate = nodeEnter.merge(node);

		nodeUpdate.transition()
			.duration(1000)
			.attr("transform", (d, i) => {
				var x = d.x * .5;
				var y = d.y + 20;
				return "translate(" + y + "," + x + ")"
			})
		
		nodeUpdate.select(".node")
			.transition()
			.duration(1000)
			.attr("width", regR * 2)
			.attr("height", regR * 2)
			.attr("rx", regR)
			.attr("ry", regR)
			.attr("transform", "translate(" + -regR + ", " + - regR + ")")
			//.attr("r", regR)

		nodeExit = node.exit()
			.remove()



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
