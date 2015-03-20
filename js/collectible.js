define(['./utils', './gameitem', './resources'], function(Utils, GameItem, Resources) {

	var CollectibleItem = function(rows, cols) {

		GameItem.GameItem.call(this);

		this.sprite = 'images/Gem Orange.png';
		this.availableRows = rows;
		this.x = Math.floor(Math.random() * cols) * this.TILE_WIDTH;
		this.row = Utils.getRandomIndex(this.availableRows);
		this.y =  this.row.row * this.TILE_HEIGHT - this.TILE_HEIGHT * 0.4;
		this.opacity = 1.0;
		this.collected = false;
		this.remove = false;

		this.update = function() {
			// if the item has been collected (player collision),
			// fade up and out during the update cycle
			if(this.collected) {
				this.y -= 5;
				this.opacity -= 0.1;
				// once the item has faded out flag it for removal by the engine
				if(this.opacity < 0.1) this.remove = true;
			}
		};

		this.render = function() {
			ctx.save();
			ctx.globalAlpha = this.opacity;
			ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
			ctx.restore();
		};

		this.callback = function() { /*noop*/ };

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
		this.callback = function(App) {
			App.points += this.points;
			console.log(app.points);
		}
	};
	Gem.constructor = Gem;


	var Key = function(rows, cols) {

		CollectibleItem.call(this, rows, cols);

		this.sprite = 'images/Key.png';
		this.points = 200;
	    this.radius = 30;
		this.callback = function(App) {
			App.points += this.points;
			console.log('Got Key!');
		}
	}
	Key.constructor = Key;


	var Heart = function(rows, cols) {

		CollectibleItem.call(this, rows, cols);

		this.sprite = 'images/Heart.png';
		this.points = 200;
	    this.radius = 30;
		this.callback = function(App) {
			App.player.lives++;
		}

	}
	Heart.constructor = Heart;


	var Star = function(rows, cols) {

		CollectibleItem.call(this, rows, cols);

		this.sprite = 'images/Star.png';
		this.points = 200;
	    this.radius = 30;
	}
	Star.constructor = Star;

	return {
		Gem: Gem,
		Key: Key,
		Heart: Heart,
		Star: Star
	}
});