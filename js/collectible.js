define(['./gameitem', './resources'], function(GameItem, Resources) {

	var CollectibleItem = function(rows, cols) {

		GameItem.GameItem.call(this);

		this.sprite = 'images/Gem Orange.png';
		this.x = Math.floor(Math.random() * cols) * this.tileWidth;
		this.y = Math.floor(Math.random() * rows) * this.yPos - this.yPos * 0.3;

		this.render = function() {
			ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
		};

	};

	var Gem = function() {

		CollectibleItem.call(this);

		var sprites = [
			'images/Gem Blue.png',
			'images/Gem Green.png',
			'images/Gem Orange.png'
		];

		var pointValues = [50, 100, 150];

		// assign a random Gem
		var level = Math.floor(Math.random() * 3);

		this.sprite = sprites[level];
		this.points = pointValues[level];
	    this.radius = 30;

	};

	var Key = function() {

		CollectibleItem.call(this);

		this.sprite = 'images/Key.png';
		this.points = 200;
	    this.radius = 30;
	}

	var Heart = function() {

		CollectibleItem.call(this);
	}

	var Star = function() {

		CollectibleItem.call(this);
	}

	return {
		Gem: Gem,
		Key: Key,
		Heart: Heart,
		Star: Star
	}
});