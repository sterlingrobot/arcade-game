define(['./utils', './resources', './gameitem'], function(Utils, Resources, GameItem) {

    var Enemy = function(tracks) {

        GameItem.MoveableItem.call(this);

        this.sprite = 'images/enemy-bug.png';
        this.radius = 30;
        this.availableRows = tracks;
        this.track = Utils.getRandomIndex(this.availableRows);
        this.speed = Math.ceil(Math.random() * 10) * 20;
        this.startY = this.track.row * this.TILE_HEIGHT - this.TILE_HEIGHT * 0.3;
        this.startX = -this.TILE_WIDTH;
        this.x = this.startX;
        this.y = this.startY;

    };

    Enemy.constructor = Enemy;

    // Draw the enemy on the screen, required method for game
    Enemy.prototype.render = function() {
        // To make the enemies go the other direction, set the canvas X scale to -1
        // but also have to set the X offset to the width of the game board
        var offsetX = this.track.dir < 0 ? this.TILE_WIDTH * this.maxCols : 0;
        ctx.save();
        ctx.transform(this.track.dir, 0, 0, 1, offsetX, 0);
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        ctx.restore();
    };

    Enemy.prototype.update = function(dt) {

        this.x += this.speed * dt;
        if(this.isOffscreen()) {
            // pick a different route & restart off-screen
            this.track = Utils.getRandomIndex(this.availableRows);
            this.y = this.track.row * this.TILE_HEIGHT - (this.TILE_HEIGHT * 0.3);
            this.x = this.startX;
        }
    };

    Enemy.prototype.isOffscreen = function() {
        return this.x > this.TILE_WIDTH * this.maxCols;
    };

    Enemy.prototype.checkCollision = function(enemies) {

        var self = this,
            hit = false;

        enemies.forEach(function(enemy) {
            if(enemy === self) return;
            if(enemy.track.row === self.track.row
                && enemy.x + enemy.radius > self.x) hit = true;
        });
        return hit;
    };

    Enemy.prototype.changeTrack = function() {

        var self = this,
            dir = Math.floor(Math.random()*2) == 1 ? 1 : -1;
        switch(self.track) {
            case 1:
                self.track++;
            break;
            case 2:
                self.track = self.track + dir;
            break;
            case 3:
                self.track--;
            break;
            default:
            break;
        }
        self.y = self.track * self.TILE_HEIGHT - self.TILE_HEIGHT * 0.3;
    };

    return(Enemy);
});