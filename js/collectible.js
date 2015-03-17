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

	var Gem = function(rows, cols) {

		CollectibleItem.call(this, rows, cols);

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
	Gem.constructor = Gem;

	var Key = function(rows, cols) {

		CollectibleItem.call(this, rows, cols);

		this.sprite = 'images/Key.png';
		this.points = 200;
	    this.radius = 30;
	}

	var Heart = function(rows, cols) {

		CollectibleItem.call(this, rows, cols);
	}

	var Star = function(rows, cols) {

		CollectibleItem.call(this, rows, cols);
	}

	return {
		Gem: Gem,
		Key: Key,
		Heart: Heart,
		Star: Star
	}
});