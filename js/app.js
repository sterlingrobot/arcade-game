var App = (function() {

    var allEnemies = [];

    for(var i = 0; i < 3; i++) {
        allEnemies.push(new Enemy());
    }

    var player = new Player();

    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.
    document.addEventListener('keyup', function(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        player.handleInput(allowedKeys[e.keyCode]);
    });

    return {
        player: player,
        allEnemies: allEnemies,
    }

})();
