define(['./utils', './resources'], function(Utils, Resources) {

'use strict';

	// Base class for all game items
	var GameItem = function() {

		this.TILE_WIDTH = 101;
		this.TILE_HEIGHT = 83;
		this.x = 0;
		this.y = 0;
		this.radius = this.TILE_WIDTH / 2;
		this.sprite = '';
		this.remove = false;

		this.render = function() {
			if(this.sprite) ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
		};

		// We will override this for entities that move backwards
	    this.getAbsoluteX = function() {
	        return this.x;
	    };

	    this.getLocation = function() {
	        var row, col;
	        row = Math.round(this.y / this.TILE_HEIGHT);
	        col = Math.round(this.x / this.TILE_WIDTH);
	        return { row: row, col: col };
	    };

	};

	var MoveableItem = function() {

		GameItem.call(this);

		this.checkCollision = function(object) {
	        return Utils.checkCollision(this, object);
	    };
	};

	MoveableItem.prototype = Object.create(GameItem.prototype);
    MoveableItem.prototype.getAbsoluteX = function() {
        var board = this.TILE_WIDTH * this.maxCols;
        return this.direction > 0 ? this.x : board - this.x;
    };

	return {
		GameItem: GameItem,
		MoveableItem: MoveableItem
	};

});