require(['gameItem', 'resources', 'app'], function(GameItem, Resources, App) {

	var CollectibleItem = function() {

		GameItem.call(this);

		this.sprite = 'images/Gem Orange.png';
		this.x = Math.floor(Math.random() * App.levels[App.level].cols) * this.tileWidth;
		this.y = Math.floor(Math.random() * App.levels[App.level].rows.length) * this.yPos - this.yPos * 0.3;

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

		this.sprite = sprites[level];
		this.points = pointValues[level];
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