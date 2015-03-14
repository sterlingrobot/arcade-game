define(function() {
	var Utils = (function() {
		return {
			getRandomIndex: function(arr) {
				return arr[Math.floor(Math.random() * arr.length)];
			}
		}
	});

	return(Utils);
});