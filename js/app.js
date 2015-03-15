define(['./player', './enemy', './collectible'], function(Player, Enemy, CollectibleItem) {

    var level, levels, lives, points, rowImages, collectibles, allEnemies, player, enemyTracks;

    level = 3;
    lives = 3;
    points = 0;

    rowImages = {
        water: 'images/water-block.png',
        stone: 'images/stone-block.png',
        grass: 'images/grass-block.png'
    };

    levels = [
       { rows: ['water', 'stone', 'stone', 'stone', 'grass', 'grass'], cols: 5,
            enemies: 2, directions: [1, 1, 1], collectibles: [] },
       { rows: ['water', 'stone', 'stone', 'grass', 'stone', 'stone', 'grass'], cols: 5,
            enemies: 4, directions: [-1, -1, 1, 1], collectibles: [] },
       { rows: ['water', 'stone', 'stone', 'water', 'stone', 'stone', 'grass'], cols: 5,
            enemies: 4, directions: [1, -1, 1, -1], collectibles: ['Gem', 'Gem', 'Key'] },
       { rows: ['water', 'stone', 'stone', 'water', 'stone', 'water', 'stone', 'grass'], cols: 5,
            enemies: 6, directions: [-1, 1, 1, -1], collectibles: ['Gem', 'Heart', 'Star'] }
    ];

    collectibles = [];

    for(var i = 0; i < levels[level].collectibles.length; i++) {
        collectibles.push(eval('new CollectibleItem.'
            + levels[level].collectibles[i]
            + '(' + levels[level].rows.length
            + levels[level].cols + ')'));
    }

    allEnemies = [];
    enemyTracks = [];

    for (var i = 0; i < levels[level].rows.length; i++) {
        if(levels[level].rows[i] === 'stone') enemyTracks.push(i);
    }

    for(i = 0; i < levels[level].enemies; i++) {
        allEnemies.push(new Enemy(enemyTracks, levels[level].cols));
    }

    player = new Player();
    player.home.x = Math.floor(levels[level].cols / 2) * player.tileWidth;
    player.home.y = (levels[level].rows.length - 1) * player.yPos - player.yPos/2;

    player.reset();

    return {
        level: level,
        levels: levels,
        lives: lives,
        points: points,
        rowImages: rowImages,
        collectibles: collectibles,
        allEnemies: allEnemies,
        player: player
    };

});
