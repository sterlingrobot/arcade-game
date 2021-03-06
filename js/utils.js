'use strict';

define({
	checkCollision: function(a,b) {

        var	dx = (a.getAbsoluteX() + a.radius) - (b.getAbsoluteX() + b.radius),
            dy = (a.y + a.TILE_HEIGHT/2 + a.radius) - (b.y + a.TILE_HEIGHT/2 + b.radius),
            distance = Math.sqrt(dx * dx + dy * dy);

        return distance < a.radius + b.radius;
	},
	getRandomIndex: function(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	},
	keyHandler: function(keyCode) {

        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            13: 'enter',
            32: 'space'
        };

       return(allowedKeys[keyCode]);
    }
});