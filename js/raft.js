define(['./gameitem', './resources'], function(GameItem, Resources) {

	'use strict';

	var Raft = function(row) {

		GameItem.MoveableItem.call(this);
		this.sprite = 'images/wood-block.png';
		this.row = row;
		this.speed = 50 + (Math.random() * 30);
		this.radius = 25;
		this.x = 0;
		this.y = this.row * this.TILE_HEIGHT - 18;
		this.direction = 1;
	};
	Raft.prototype = Object.create(GameItem.MoveableItem.prototype);
	Raft.constructor = Raft;

	Raft.prototype.update = function(dt) {
        if(this.x > this.TILE_WIDTH * (this.maxCols - 1)) this.direction = -1;
        if(this.x < 0) this.direction = 1;
        this.x += this.speed * this.direction * dt;
	};

	return(Raft);

});