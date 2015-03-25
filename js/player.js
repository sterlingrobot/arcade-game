define(['./utils', './resources', './gameitem'], function(Utils, Resources, GameItem) {

'use strict';

    var Player = function() {

        GameItem.MoveableItem.call(this);
        this.lives = 3;
        this.radius = 25;
        this.onRaft = false;

        // We need to hold a pointer to this function in order to remove
        // the listener later
        this.keyEventHandler = this.keyHandler.bind(this);

    };

    Player.prototype = Object.create(GameItem.MoveableItem.prototype);
    Player.constructor = Player;

    Player.prototype.render = function() {

        var char = this.sprite || 'images/char-boy.png';
        ctx.drawImage(Resources.get(char), this.x, this.y);

    };

    Player.prototype.selectCharacter = function(char) {
        this.sprite = char.image;
    };

    Player.prototype.update = function(dt) {
        if(this.onRaft) this.x = this.raft.x;
    };

    Player.prototype.reset = function() {

        var self = this;

        // method is called after collision, so remove keystroke handler
        // while player is being reset
        // TODO:: custom animation to reset the player?
        document.removeEventListener('keyup', self.keyEventHandler, false);

        self.x = self.startX;
        self.y = self.startY;

        // activate or reactivate (after collision) the keystroke handler
        document.addEventListener('keyup', self.keyEventHandler, false);

    };

    Player.prototype.getLocation = function() {
        var row, col;
        row = Math.round(this.y / this.TILE_HEIGHT);
        col = Math.round(this.x / this.TILE_WIDTH);
        return { row: row, col: col };
    };

    Player.prototype.startRafting = function(raft) {
        this.onRaft = true;
        this.raft = raft;
    };

    Player.prototype.stopRafting = function() {
        this.onRaft = false;
        this.x = Math.round(this.x / this.TILE_WIDTH) * this.TILE_WIDTH;
    };

    Player.prototype.loseLife = function() {
        this.lives--;
        console.log(this.lives + ' lives left!');
    };

    Player.prototype.handleInput = function(dir) {

        switch(dir) {
            case 'left':
                if(this.x - this.TILE_WIDTH < 0) return;
                this.x -= this.TILE_WIDTH;
            break;
            case 'up':
                if(this.y - this.TILE_HEIGHT < 0) this.reset();
                else this.y -= this.TILE_HEIGHT;
            break;
            case 'right':
                if(this.x + this.TILE_WIDTH > this.maxCols * (this.TILE_WIDTH - 1)) return;
                this.x += this.TILE_WIDTH;
            break;
            case 'down':
                if(this.y + this.TILE_HEIGHT > this.startY) return;
                this.y += this.TILE_HEIGHT;
            break;
            default:
            break;
        }

        if(this.onRaft) this.stopRafting();

        this.render();
    };

    Player.prototype.keyHandler = function(e) {

        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

       this.handleInput(allowedKeys[e.keyCode]);
    };

    return(Player);

});