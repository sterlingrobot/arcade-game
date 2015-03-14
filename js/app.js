requirejs.config({
    baseUrl: "/nanodegree/arcade-game/js"
});

require(['player', 'enemy', 'collectible'], function(Player, Enemy, CollectibleItem) {

    var App = function() {

        App.level = 0;
        App.lives = 3;
        App.points = 0;

        App.rowImages = {
            water: 'images/water-block.png',
            stone: 'images/stone-block.png',
            grass: 'images/grass-block.png'
        };

        App.levels = [
           { rows: ['water', 'stone', 'stone', 'stone', 'grass', 'grass'], cols: 5,
                enemies: 2, directions: [1, 1, 1], collectibles: [] },
           { rows: ['water', 'stone', 'stone', 'grass', 'stone', 'stone', 'grass'], cols: 5,
                enemies: 4, directions: [-1, -1, 1, 1], collectibles: [] },
           { rows: ['water', 'stone', 'stone', 'water', 'stone', 'stone', 'grass'], cols: 5,
                enemies: 4, directions: [1, -1, 1, -1], collectibles: ['Gem', 'Gem', 'Key'] },
           { rows: ['water', 'stone', 'stone', 'water', 'stone', 'water', 'stone', 'grass'], cols: 5,
                enemies: 6, directions: [-1, 1, 1, -1], collectibles: ['Gem', 'Heart', 'Star'] }
        ];

        App.collectibles = [];

        for(var i = 0; i < levels[level].collectibles.length; i++) {
            App.collectibles.push(eval('new ' + levels[level].collectibles[i] + '()'));
        }

        App.allEnemies = [];

        for(i = 0; i < levels[level].enemies; i++) {
            App.allEnemies.push(new Enemy());
        }

        App.player = new Player();

        App.player.reset();


        return(App);

    }
});
