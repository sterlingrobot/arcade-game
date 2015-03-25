'use strict';

define(['./player', './enemy', './collectible', './raft'], function(Player, Enemy, CollectibleItem, Raft) {

    var level, levels, lives, points, rowImages, collectibles, allEnemies, player, stoneRows, allRafts;

    level = 0;
    points = 0;

    rowImages = {
        water: 'images/water-block.png',
        stone: 'images/stone-block.png',
        grass: 'images/grass-block.png'
    };

    levels = [
       { rows: ['water', 'stone', 'stone', 'stone', 'grass', 'grass'], cols: 5,
            enemies: 3, directions: [1, -1, 1], collectibles: [CollectibleItem.Gem] },
       { rows: ['water', 'stone', 'stone', 'water', 'stone', 'stone', 'grass'], cols: 5,
            enemies: 4, directions: [-1, -1, 1, 1], collectibles: [CollectibleItem.Gem CollectibleItem.Gem] },
       { rows: ['water', 'stone', 'stone', 'water', 'stone', 'stone', 'grass'], cols: 5,
            enemies: 5, directions: [1, -1, 1, -1], collectibles: [CollectibleItem.Gem, CollectibleItem.Gem, CollectibleItem.Key] },
       { rows: ['water', 'stone', 'stone', 'water', 'stone', 'water', 'stone', 'grass'], cols: 5,
            enemies: 6, directions: [-1, 1, 1, -1], collectibles: [CollectibleItem.Gem, CollectibleItem.Heart, CollectibleItem.Star] }
    ];

    collectibles = [];

    allRafts = [];

    allEnemies = [];

    /* Create an array of rows that will have enemies, collectibles corresponding to
     *  row numbers, and assign directions (whether the enemies move left -1 or right 1)
     */
    stoneRows = [];

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

    for(var c = 0; c < levels[level].collectibles.length; c++) {
        var collectible = new levels[level].collectibles[c](stoneRows, levels[level].cols);
        collectibles.push(collectible);
    }

    for(var t = 0; t < levels[level].enemies; t++) {
        var enemy = new Enemy(stoneRows);
        enemy.maxCols = levels[level].cols;
        allEnemies.push(enemy);
    }

    player = new Player();

    player.startX = Math.floor(levels[level].cols / 2) * player.TILE_WIDTH;
    player.startY = (levels[level].rows.length - 1) * player.TILE_HEIGHT - player.TILE_HEIGHT/2;
    player.maxCols = levels[level].cols;

    player.reset();

    return {
        TILE_HEIGHT: player.TILE_HEIGHT,
        TILE_WIDTH: player.TILE_WIDTH,
        level: level,
        levels: levels,
        points: points,
        rowImages: rowImages,
        collectibles: collectibles,
        allEnemies: allEnemies,
        allRafts: allRafts,
        player: player
    };

});