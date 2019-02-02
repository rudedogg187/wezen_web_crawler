document.addEventListener("DOMContentLoaded", main);
var canvas = {};


function getCanvasBounds() {
	var y = canvas.cont.node().getBoundingClientRect().y;
	var h = screen.height;

	canvas.bounds = {
		width: .95 * canvas.cont.node().getBoundingClientRect().width,
		height: (h - y) * .80,
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

function buildTree(data) {
	console.log(JSON.stringify(data));


		

	var l1Nodes = data[0].children;

	var l1Node = canvas.g.selectAll(".level-one")
		.data(l1Nodes);

	l1Node.enter()
		.append("circle")
		.attr("class", ".level-one node")
		.attr("r", 10)
		.attr("cx", (d, i) => {
			return 20 + i * 75;
		})
		.attr("cy", 50)
		.on("click", (d) => { console.log(data[d]); })





	
	

}


function main() {
	addCanvas("#tree-canvas");
	console.log(canvas);

}
