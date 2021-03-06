define(['./utils', './gameitem', './announce', './resources'], function(Utils, GameItem, Announce, Resources) {

	'use strict';

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

	};
	CollectibleItem.prototype = Object.create(GameItem.GameItem.prototype);
	CollectibleItem.constructor = CollectibleItem;

	CollectibleItem.prototype.update = function() {
		// if the item has been collected (player collision),
		// fade up and out during the update cycle
		if(this.collected) {
			this.y -= 5;
			this.opacity -= 0.1;
			// once the item has faded out flag it for removal by the engine
			if(this.opacity < 0.1) this.remove = true;
		}
	};

	CollectibleItem.prototype.render = function() {
		ctx.save();
		ctx.globalAlpha = this.opacity;
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
		ctx.restore();
	};

	CollectibleItem.prototype.callback = function() { /*noop*/ };

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
    Gem.prototype = Object.create(CollectibleItem.prototype);
	Gem.constructor = Gem;
	Gem.prototype.callback = function(App) {

		var announcement = new Announce();
		announcement.reset();
		announcement.life = 1000;
		announcement.sizes = [60];
		announcement.messages.push('+' + this.points);

		App.announcements.push(announcement);
		App.addPoints(this.points);
	};


	var Key = function(rows, cols) {

		CollectibleItem.call(this, rows, cols);

		this.sprite = 'images/Key.png';
		this.points = 200;
	    this.radius = 30;
	    // always put the key on the top row
	    this.row = rows[0];
		this.y =  this.row.row * this.TILE_HEIGHT - this.TILE_HEIGHT * 0.4;
	};
    Key.prototype = Object.create(CollectibleItem.prototype);
	Key.constructor = Key;
	Key.prototype.callback = function(App) {
		App.addPoints(this.points);
		console.log('Got Key!');
	};


	var Heart = function(rows, cols) {

		CollectibleItem.call(this, rows, cols);

		this.sprite = 'images/Heart.png';
		this.points = 200;
	    this.radius = 30;

	};
    Heart.prototype = Object.create(CollectibleItem.prototype);
	Heart.constructor = Heart;
	Heart.prototype.callback = function(App) {
		App.player.lives++;
	};


	var Star = function(rows, cols) {

		CollectibleItem.call(this, rows, cols);

		this.sprite = 'images/Star.png';
		this.points = 200;
	    this.radius = 30;
	    // always put the star on the top row
	    this.row = rows[0];
		this.y =  this.row.row * this.TILE_HEIGHT - this.TILE_HEIGHT * 0.4;
	};
    Star.prototype = Object.create(CollectibleItem.prototype);
	Star.constructor = Star;
	Star.prototype.callback = function(App) {
		App.addPoints(this.points);
	};

	return {
		Gem: Gem,
		Key: Key,
		Heart: Heart,
		Star: Star
	};
});