require(['app'], function(App) {

    var Player = function () {

        MoveableItem.call(this);
        this.radius = 25;
        this.home = { x: 2 * this.tileWidth, y: 5 * this.yPos - this.yPos/2 };
        this.x = this.home.x;
        this.y = this.home.y;
    }

    Player.constructor = Player;

    Player.prototype.render = function() {

        var char = this.sprite || 'images/char-boy.png';
        ctx.drawImage(Resources.get(char), this.x, this.y);

    };

    Player.prototype.selectCharacter = function(char) {
        this.sprite = char.image;
    };

    Player.prototype.update = function(dt) {

    };

    Player.prototype.reset = function() {

        var self = this;

        // method is called after collision, so remove keystroke handler
        // while player is being reset
        // TODO:: custom animation to reset the player?
        document.removeEventListener('keyup', keyHandler);

        self.x = self.home.x;
        self.y = self.home.y;

        // activate or reactivate (after collision) the keystroke handler
        document.addEventListener('keyup', keyHandler);

    };

    Player.prototype.checkCollision = function(enemy) {

        var self =this,
            dx = (self.x + self.radius) - (enemy.x + enemy.radius),
            dy = (self.y + self.yPos/2 + self.radius) - (enemy.y + enemy.radius),
            distance = Math.sqrt(dx * dx + dy * dy);

        return distance < self.radius + enemy.radius;
    };

    Player.prototype.handleInput = function(dir) {
        switch(dir) {
            case 'left':
                if(this.x - this.tileWidth < 0) return;
                this.x -= this.tileWidth;
            break;
            case 'up':
                if(this.y - this.yPos < 0) return;
                this.y -= this.yPos;
            break;
            case 'right':
                if(this.x + this.tileWidth > 505 - this.tileWidth) return;
                this.x += this.tileWidth;
            break;
            case 'down':
                if(this.y + this.yPos > 606 - (this.yPos * 2)) return;
                this.y += this.yPos;
            break;
            default:
            break;
        }

        this.render();
    };

    var keyHandler = function(e) {

        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        App.player.handleInput(allowedKeys[e.keyCode]);
    };

    return(Player);

});