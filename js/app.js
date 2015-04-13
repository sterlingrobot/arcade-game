'use strict';

define(['./utils', './resources', './gameitem', './announce', './player', './enemy', './collectible', './raft'],

    function(Utils, Resources, GameItem, Announce, Player, Enemy, CollectibleItem, Raft) {

        var debug = false;
        var level, points, rowImages, characters, levels, TILE_WIDTH, TILE_HEIGHT,
            reset, init, levelUp, getLevel, getPoints, addPoints, completedLevel,
            startScreen, tryAgain, gameOver, wonGame,
            player, allEnemies, collectibles, allRafts,
            entities, announcements, selector, stoneRows;

        announcements = [];
        collectibles = [];
        allRafts = [];
        allEnemies = [];
        entities = [];
        stoneRows = [];


       // Initialize our persistent entities
        player = new Player();
        TILE_WIDTH = player.TILE_WIDTH;
        TILE_HEIGHT = player.TILE_HEIGHT;

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

        function collectedGems() {

            var gems = 0;
            player.collectibles.forEach(function(collectible) {
                if(collectible instanceof CollectibleItem.Gem) gems++;
            });
            return (gems === levels[level].collectibles.length);
        }

        function collectedKey() {

            return player.collectibles.some(function(collectible) {
                return(collectible instanceof CollectibleItem.Key);
            });
        }

        function collectedStar() {

            return player.collectibles.some(function(collectible) {
                return(collectible instanceof CollectibleItem.Star);
            });
        }

        levels = [
            { // First level is player selection
                announcements: ['Choose your Player!', 'Enter to choose'],
                announceImg: 'images/selector-keys.png',
                rows: ['water', 'stone', 'stone', 'stone', 'grass', 'grass'],
                cols: 5,
                enemies: 0,
                directions: [],
                collectibles: [],
                goal: selectedPlayer
            },
            {
                announcements: ['Get to the Water!', 'Use your arrows to move'],
                announceImg: 'images/player-keys.png',
                rows: ['water', 'stone', 'stone', 'stone', 'grass', 'grass'],
                cols: 5,
                enemies: debug ? 0 : 3,
                directions: [1, -1, 1],
                collectibles: [CollectibleItem.Gem],
                goal: reachedWater
            },
            {
                announcements: ['Collect all the Gems!'],
                announceImg: '',
                rows: ['stone', 'stone', 'stone', 'water', 'stone', 'stone', 'grass'],
                cols: 5,
                enemies: debug ? 0 : 4,
                directions: [-1, -1, 1, 1],
                collectibles: [CollectibleItem.Gem, CollectibleItem.Gem, CollectibleItem.Gem, CollectibleItem.Gem],
                goal: collectedGems
            },
            {
                announcements: ['Collect the Key!'],
                announceImg: '',
                rows: ['stone', 'stone', 'stone', 'water', 'stone', 'stone', 'grass'],
                cols: 5,
                enemies: debug ? 0 : 5,
                directions: [1, -1, 1, -1],
                collectibles: [CollectibleItem.Gem, CollectibleItem.Gem, CollectibleItem.Key],
                goal: collectedKey
            },
            {
                announcements: ['Collect the Star!'],
                announceImg: '',
                rows: ['stone', 'water', 'stone', 'water', 'stone', 'water', 'stone', 'grass'],
                cols: 5,
                enemies: debug ? 0 : 6,
                directions: [-1, 1, 1, -1],
                collectibles: [CollectibleItem.Gem, CollectibleItem.Heart, CollectibleItem.Star],
                goal: collectedStar
            }
        ];

        reset = function() {

            level = 0;
            points = 0;
            player.lives = 3;
            player.collectibles = [];
            player.reset();

        };

        init = function() {

            console.log('Level ' + level + ' init: ' + levels[level].cols + ' x ' + levels[level].rows.length);

            /* Prevent announcement if level has already completed
             * i.e. restarting the game, skips player selection
             */
            if(!completedLevel()) {
                var announcement = new Announce();
                announcement.reset();
                announcement.sizes = [60, 48, 36];
                announcement.sprite = levels[level].announceImg;
                if(level > 0) announcement.messages = ['Level ' + level].concat(levels[level].announcements);
                else announcement.messages = levels[level].announcements;

                announcements.push(announcement);
            }
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

                // Player is not active, but we place it on the bottom row so they don't drown!
                // And so that it is ready to render on first level init
                player.x = Math.floor(levels[level].cols / 2) * player.TILE_WIDTH;
                player.y = (levels[level].rows.length - 1) * player.TILE_HEIGHT - player.TILE_HEIGHT/2;

                // Create the Start screen for character selection
                for(var p = 0; p < characters.length; p++) {

                    var character = new GameItem.GameItem();
                    character.sprite = characters[p];
                    character.x = p * character.TILE_WIDTH;
                    character.y = (levels[level].rows.length - 1) * character.TILE_HEIGHT - character.TILE_HEIGHT/2;

                    entities.push(character);
                }

                selector = createSelector();

                // Add to the beginning of the entities array so it renders first
                entities.unshift(selector);


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

            var announcement;

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

                player.collectibles = [];

                if(level > 1) {
                    announcement = new Announce();
                    announcement.reset();
                    announcement.life = 2000;
                    announcement.sizes = [60];
                    announcement.messages.push('You Did It!');

                    announcements.push(announcement);
                }
            }

            return level;
        };

        getLevel = function() {
            return level;
        };

        getPoints = function() {
            return points;
        };

        addPoints = function(pts) {
            points += pts;
        };

        completedLevel = function() {
            return levels[level].goal();
        };

        startScreen = function() {

            var announcement;

            announcement = new Announce();
            announcement.reset();
            announcement.life = 1000;
            announcement.sizes = [60, 36];
            announcement.sprite = 'images/start-key.png';
            announcement.messages.push('Ready to Play?');
            announcement.messages.push('Press Spacebar to Start!');

            announcements.push(announcement);

        };

        tryAgain = function(msg) {

            var announcement;

            announcement = new Announce();
            announcement.reset();
            announcement.life = 5000;
            announcement.sizes = [60, 48];
            announcement.messages.push(msg.toUpperCase() + '!');
            announcement.messages.push('Try Again!');

            announcements.push(announcement);
        };

        gameOver = function() {

            var announcement;

            announcement = new Announce();
            announcement.reset();
            announcement.life = 1000;
            announcement.sizes = [60, 48];
            announcement.sprite = 'images/start-key.png';
            announcement.messages.push('GAME OVER!', 'Press spacebar to Play Again!');

            announcements.push(announcement);

        };

        wonGame = function() {

            var announcement;

            announcement = new Announce();
            announcement.reset();
            announcement.life = 1000;
            announcement.sizes = [60, 48, 48];
            announcement.messages.push('YOU WON!', 'You got ' + getPoints() + ' points!');
            announcement.messages.push('Play Again?');
            announcement.sprite = 'images/start-key.png';

            announcements.push(announcement);

        };

        function createSelector() {

            var selector = new GameItem.MoveableItem();
            selector.x = Math.floor(levels[level].cols / 2) * selector.TILE_WIDTH;
            selector.y = (levels[level].rows.length - 1) * selector.TILE_HEIGHT - selector.TILE_HEIGHT/2;

            selector.sprite = 'images/Selector.png';

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
                            if(entity !== self && selector.checkCollision(entity)) {
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

            return(selector);
        }


        // Expose entities and level variables for use by the game engine
        return {

            // config proerties
            TILE_HEIGHT: TILE_HEIGHT,
            TILE_WIDTH: TILE_WIDTH,
            levels: levels,
            rowImages: rowImages,

            // level entities
            announcements: announcements,
            collectibles: collectibles,
            allEnemies: allEnemies,
            allRafts: allRafts,
            player: player,
            entities: entities,

            // app methods
            reset: reset,
            init: init,
            levelUp: levelUp,
            getLevel: getLevel,
            getPoints: getPoints,
            addPoints: addPoints,
            completedLevel: completedLevel,
            startScreen: startScreen,
            tryAgain: tryAgain,
            gameOver: gameOver,
            wonGame: wonGame
        };

});