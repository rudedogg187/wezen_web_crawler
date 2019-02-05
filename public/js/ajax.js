const ajax = {
	get: function(url, callback) {
		console.log("ajax.get('" + url + "');");
		var req = new XMLHttpRequest();
		req.open("GET", url, true);
		req.addEventListener("load", function(event) {
			res = JSON.parse(req.responseText);
			console.log(res);
			callback(res);

		});
		req.send();
	},

	post: function(url, payload, callback) {
		console.log("ajax.post('" + url + "');");
		var req = new XMLHttpRequest();
		req.open("POST", url, true);
		req.setRequestHeader("Content-Type", "application/json");
		req.addEventListener("load", function(event) {
			console.log(req.responseText);
			res = JSON.parse(req.responseText);
			console.log(res);
			callback(res);
		});
		req.send(JSON.stringify(payload));
		
	}
}
 
 
