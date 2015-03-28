'use strict';

define(['./utils', './resources', './gameitem', './player', './enemy', './collectible', './raft'],
    function(Utils, Resources, GameItem, Player, Enemy, CollectibleItem, Raft) {

        var level, points, rowImages, characters, levels,
            init, levelUp, getLevel, completedLevel,
            player, allEnemies, collectibles, allRafts, entities, selector, stoneRows;

        // Initialize our player
        player = new Player();

        level = 0;
        points = 0;

        rowImages = {
            water: 'images/water-block.png',
            stone: 'images/stone-block.png',
            grass: 'images/grass-block.png'
        };

        characters = [
            'images/char-boy.png',
            'images/char-cat-girl.png',
            'images/char-horn-girl.png',
            'images/char-pink-girl.png',
            'images/char-princess-girl.png'
        ];

        /*
         *  Define goals for levels.  Engine will check against each levels goal function
            to determine if the App should levelUp
        */

        function selectedPlayer() { return (player.sprite !== ''); }

        function reachedWater() { return (player.getLocation().row === 0); }

        levels = [
            // First level is the game orientation and player selection
           { rows: ['water', 'stone', 'stone', 'stone', 'grass', 'grass'], cols: 5,
                enemies: 0, directions: [], collectibles: [], goal: selectedPlayer },
           { rows: ['water', 'stone', 'stone', 'stone', 'grass', 'grass'], cols: 5,
                enemies: 3, directions: [1, -1, 1], collectibles: [CollectibleItem.Gem],
                    goal: reachedWater },
           { rows: ['water', 'stone', 'stone', 'water', 'stone', 'stone', 'grass'], cols: 5,
                enemies: 4, directions: [-1, -1, 1, 1], collectibles: [CollectibleItem.Gem, CollectibleItem.Gem],
                    goal: reachedWater },
           { rows: ['water', 'stone', 'stone', 'water', 'stone', 'stone', 'grass'], cols: 5,
                enemies: 5, directions: [1, -1, 1, -1], collectibles: [CollectibleItem.Gem, CollectibleItem.Gem, CollectibleItem.Key], goal: reachedWater  },
           { rows: ['water', 'stone', 'stone', 'water', 'stone', 'water', 'stone', 'grass'], cols: 5,
                enemies: 6, directions: [-1, 1, 1, -1], collectibles: [CollectibleItem.Gem, CollectibleItem.Heart, CollectibleItem.Star], goal: reachedWater }
        ];

        collectibles = [];
        allRafts = [];
        allEnemies = [];
        entities = [];
        stoneRows = [];

        init = function() {

            console.log('App init: ' + levels[level].cols + ' x ' + levels[level].rows.length);

            /* Create an array of rows that will have enemies, collectibles corresponding to
             *  row numbers, and assign directions (whether the enemies move left -1 or right 1)
             */

            for(var i = 0, d = 0; i < levels[level].rows.length; i++) {
                if(levels[level].rows[i] === 'stone') {
                    stoneRows.push({ row: i, dir: levels[level].directions[d] });
                    d++;
                }
                // If there is a water row in the middle of the course, it gets a wooden raft
                if(i > 0 && levels[level].rows[i] === 'water') {
                    var raft = new Raft(i);
                    raft.maxCols = levels[level].cols;
                    allRafts.push(raft);
                }

            }

            // Add collectibles (Gem, Key, Heart, Star) based on the level
            for(var c = 0; c < levels[level].collectibles.length; c++) {
                var collectible = new levels[level].collectibles[c](stoneRows, levels[level].cols);
                collectibles.push(collectible);
            }

            // Add enemies to the allEnemies array
            for(var t = 0; t < levels[level].enemies; t++) {
                var enemy = new Enemy(stoneRows);
                enemy.maxCols = levels[level].cols;
                allEnemies.push(enemy);
            }

            if(level === 0) {

                // Create the Start screen for character selection
                for(var p = 0; p < characters.length; p++) {

                    var character = new GameItem.GameItem();
                    character.sprite = characters[p];
                    character.x = p * character.TILE_WIDTH;
                    character.y = (levels[level].rows.length - 1) * character.TILE_HEIGHT - character.TILE_HEIGHT/2;

                    entities.push(character);
                }

                selector = new GameItem.MoveableItem();
                selector.sprite = 'images/Selector.png';
                selector.x = Math.floor(levels[level].cols / 2) * selector.TILE_WIDTH;
                selector.y = (levels[level].rows.length - 1) * selector.TILE_HEIGHT - selector.TILE_HEIGHT/2;
                selector.handleInput = function(dir) {
                    var self = this;
                    switch(dir) {
                        case 'left':
                            if(self.x > 0) self.x -= self.TILE_WIDTH;
                        break;
                        case 'right':
                            if(self.x < (levels[level].cols - 1) * self.TILE_WIDTH) self.x += self.TILE_WIDTH;
                        break;
                        case 'enter':
                            entities.forEach(function(entity) {
                                if(entity !== self && self.checkCollision(entity)) {
                                    player.sprite = entity.sprite;
                                }
                            });
                        break;
                        default :
                        break;
                    }

                };
                selector.keyHandler = function(e) {
                    selector.handleInput(Utils.keyHandler(e.keyCode));
                };
                document.addEventListener('keyup', selector.keyHandler, false);

                // Add to the beginning of the entities array so it renders first
                entities.unshift(selector);

                // Player is not active at this stage, so we'll just store it offscreen
                // but we have to place it below the bottom row so they don't drown!
                player.y = (levels[level].rows.length) * player.TILE_HEIGHT - player.TILE_HEIGHT/2;

            } else {

                // Based on the game board, assign player's starting point at the last row, center
                player.startX = Math.floor(levels[level].cols / 2) * player.TILE_WIDTH;
                player.startY = (levels[level].rows.length - 1) * player.TILE_HEIGHT - player.TILE_HEIGHT/2;
                player.maxCols = levels[level].cols;

                // Call the reset method to set x, y and initialize the keystroke handler
                player.reset();
            }

            return(this);
        };

        levelUp = function() {

            if(level < levels.length - 1) {

                level++;

                console.log('Level: ' + level);

                if(selector) document.removeEventListener('keyup', selector.keyHandler, false);

                // reset all entity groups by setting remove flag
                [collectibles, allRafts, allEnemies, entities].forEach(function(group) {
                    group.forEach(function(item) {
                        item.remove = true;
                    });
                    group = [];
                });
                stoneRows = [];

            }

            return level;

        };

        getLevel = function() {
            return level;
        };

        completedLevel = function() {
            return levels[level].goal();
        };

        // Expose entities and level variables for use by the game engine
        return {
            TILE_HEIGHT: 83,
            TILE_WIDTH: 101,
            levels: levels,
            points: points,
            rowImages: rowImages,
            collectibles: collectibles,
            allEnemies: allEnemies,
            allRafts: allRafts,
            player: player,
            entities: entities,
            init: init,
            levelUp: levelUp,
            getLevel: getLevel,
            completedLevel: completedLevel
        };

});