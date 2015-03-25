define(['./gameitem', './resources'], function(GameItem, Resources) {

'use strict';

	var Raft = function(row) {

		GameItem.MoveableItem.call(this);
		this.sprite = 'images/wood-block.png';
		this.row = row;
		this.speed = 50;
		this.radius = 30;
		this.x = 0;
		this.y = this.row * this.TILE_HEIGHT - 18;
		this.direction = 1;
	};
	Raft.constructor = Raft;

	Raft.prototype.render = function() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	};

	Raft.prototype.update = function(dt) {
        if(this.x > this.TILE_WIDTH * (this.maxCols - 1)) this.direction = -1;
        if(this.x < 0) this.direction = 1;
        this.x += this.speed * this.direction * dt;
	};

	return(Raft);

});