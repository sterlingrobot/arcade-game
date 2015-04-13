define(['./utils', './resources', './gameitem'], function(Utils, Resources, GameItem) {

    'use strict';

    var Enemy = function(tracks) {

        GameItem.MoveableItem.call(this);

        this.sprite = 'images/enemy-bug.png';
        this.radius = 30;
        this.availableRows = tracks;
        this.track = Utils.getRandomIndex(this.availableRows);
        this.speed = Math.ceil(Math.random() * 10) * 20;
        this.direction = this.track.dir;
        this.startY = this.track.row * this.TILE_HEIGHT - this.TILE_HEIGHT * 0.3;
        this.startX = -this.TILE_WIDTH;
        this.x = this.startX;
        this.y = this.startY;

    };
    Enemy.prototype = Object.create(GameItem.MoveableItem.prototype);
    Enemy.constructor = Enemy;

    // Draw the enemy on the screen, required method for game
    Enemy.prototype.render = function() {
        // To make the enemies go the other direction, set the canvas X scale to -1
        var offsetX = this.direction < 0 ? this.TILE_WIDTH * this.maxCols : 0;
        ctx.save();
        ctx.transform(this.direction, 0, 0, 1, offsetX, 0);
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        ctx.restore();
    };

    Enemy.prototype.update = function(dt) {

        this.x += this.speed * dt;
        if(this.isOutOfBounds()) {
            // pick a different route & restart off-screen
            this.track = Utils.getRandomIndex(this.availableRows);
            this.y = this.track.row * this.TILE_HEIGHT - (this.TILE_HEIGHT * 0.3);
            this.x = this.startX;
            this.direction = this.track.dir;
        }
    };

    Enemy.prototype.isOutOfBounds = function() {
        return this.x > this.TILE_WIDTH * this.maxCols;
    };

    return(Enemy);
});