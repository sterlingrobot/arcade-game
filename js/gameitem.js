define(['./utils'], function(Utils) {

'use strict';

	// Base class for all game items
	var GameItem = function() {

		this.TILE_WIDTH = 101;
		this.TILE_HEIGHT = 83;
	    this.getAbsoluteX = function() {
	        return this.x;
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