require(['utils', 'app'], function(Utils, App) {

    var Enemy = function() {

        MoveableItem.call(this);

        var rows = App.levels[App.level].rows,
            availableTracks = [];

        for (var i = 0; i < rows.length; i++) {
            if(rows[i] === 'stone') availableTracks.push(i);
        }
        this.sprite = 'images/enemy-bug.png';
        this.radius = 30;
        this.track = Utils.getRandomIndex(availableTracks);
        this.speed = Math.ceil(Math.random() * 10) * 20;
        this.x = -this.tileWidth;
        this.y =  this.track * this.yPos - this.yPos * 0.3;

    };

    Enemy.constructor = Enemy;

    Enemy.prototype.update = function(dt) {

        this.x += this.speed * dt;
        if(this.x > this.tileWidth * App.levels[App.level].cols) {
            // restart off-screen
            this.x = -this.tileWidth;
            // pick a different route
            this.y = Math.ceil(Math.random() * 3) * this.yPos - (this.yPos * 0.3);
        }
    };

    Enemy.prototype.checkCollision = function(enemies) {

        var self = this,
            hit = false;

        enemies.forEach(function(enemy) {
            if(enemy === self) return;
            if(enemy.track === self.track
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
        self.y = self.track * self.yPos - self.yPos * 0.3;
    };
    // Draw the enemy on the screen, required method for game
    Enemy.prototype.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

    return(Enemy);
});