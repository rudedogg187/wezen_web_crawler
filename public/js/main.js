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


function main() {
	addCanvas("#tree-canvas");

	console.log(canvas);

}
