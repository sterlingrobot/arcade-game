requirejs.config({
    baseUrl: '/nanodegree/arcade-game/js'
});

require(['./app', './resources'], function(App, Resources) {

'use strict';

    var Engine = (function() {

        var doc = document,
            win = window,
            canvas = doc.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            canvasBkgnd = doc.createElement('canvas'),
            ctxBkgnd = canvasBkgnd.getContext('2d'),
            canvasInfo = doc.createElement('canvas'),
            ctxInfo = canvasInfo.getContext('2d'),
            score = doc.getElementById('score'),
            lives = doc.getElementById('lives'),
            info, lastTime;

        info = doc.body.appendChild(canvasInfo);
        info.className = 'info';
        doc.body.appendChild(canvasBkgnd);
        doc.body.appendChild(canvas);

        function main() {

            var now = Date.now(),
                dt = (now - lastTime) / 1000.0;

            update(dt);
            render();

            lastTime = now;

            win.requestAnimationFrame(main);
        }

        function init() {

            console.log('Game init: Level ' + App.getLevel() + ':' + App.levels[App.getLevel()].cols + ' x ' + App.levels[App.getLevel()].rows.length);

            var width = App.TILE_WIDTH,
                height = App.TILE_HEIGHT,
                row, col;

            App.init();

            canvas.width = App.levels[App.getLevel()].cols * App.TILE_WIDTH;
            canvas.height = App.levels[App.getLevel()].rows.length * (App.TILE_HEIGHT + 18);
            canvasBkgnd.width = canvas.width;
            canvasBkgnd.height = canvas.height;
            canvasInfo.width = canvas.width;
            canvasInfo.height = 55;
            ctxInfo.font = '48px sans-serif';
            ctxInfo.fillStyle = '#000';

            // ctxBkgnd.clearRect(0, 0, canvasBkgnd.width, canvasBkgnd.height);

            reset();

            lastTime = Date.now();

            for (row = 0; row < App.levels[App.getLevel()].rows.length; row++) {
                for (col = 0; col < App.levels[App.getLevel()].cols; col++) {
                    ctxBkgnd.drawImage(Resources.get(App.rowImages[App.levels[App.getLevel()].rows[row]]),
                        col * width, row * height);
                }
            }

            main();

        }

        function update(dt) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            updateEntities(dt);
        }

        function updateEntities(dt) {

            var collision = false,
                drown = false;

            App.player.update();
            if(App.completedLevel()) {
                App.levelUp();
                init();
                return;
            }

            App.entities.forEach(function(entity) {
                if(entity.remove) App.entities.splice(App.entities.indexOf(entity), 1);
            });

            App.allEnemies.forEach(function(enemy) {

                if(enemy.remove) App.allEnemies.splice(App.allEnemies.indexOf(enemy), 1);

                enemy.update(dt);

                // App.allEnemies.forEach(function(enemy2) {
                //     if(enemy !== enemy2 && enemy.checkCollision(enemy2)) {
                //         if(enemy.getAbsoluteX() < enemy2.getAbsoluteX()) {
                //             enemy.direction = -1;
                //             enemy2.direction = 1;
                //         } else {
                //             enemy.direction = 1;
                //             enemy2.direction = -1;
                //         }
                //     }
                // });
            });

            App.allRafts.forEach(function(raft) {

                if(raft.remove) App.allRafts.splice(App.allRafts.indexOf(raft), 1);

                raft.update(dt);

                if(App.player.checkCollision(raft)) {
                    App.player.startRafting(raft);
                }
            });

            collision = App.allEnemies.some(function(enemy) {
                return App.player.checkCollision(enemy);
            });

            drown = App.levels[App.getLevel()].rows[App.player.getLocation().row] === 'water' && !App.player.onRaft;

            if(collision || drown) {
                App.player.loseLife();
                if(App.player.lives === 0) console.log('GAME OVER');
                else App.player.reset();

                return;
            }

            App.collectibles.forEach(function(collectible) {

                if(collectible.remove) App.collectibles.splice(App.collectibles.indexOf(collectible), 1);

                collectible.update();

                if(App.player.checkCollision(collectible) && !collectible.collected) {
                    collectible.collected = true;
                    collectible.callback(App);
                }

            });


        }

        function render() {

            renderInfo();
            renderEntities();
        }

        function renderInfo() {

            var text = App.points.toString();

            ctxInfo.clearRect(0, 0, canvasInfo.width, canvasInfo.height);

            ctxInfo.fillText(text, 300, 0);

            for(var i = 0; i < App.player.lives; i++) {
                ctxInfo.drawImage(Resources.get('images/Heart.png'),
                    i * 50, 0, App.TILE_WIDTH / 2, App.TILE_HEIGHT * 0.8);
            }

        }

        function renderEntities() {

            App.allRafts.forEach(function(raft) {
                raft.render();
            });

            App.collectibles.forEach(function(collectible) {
                collectible.render();
            });

            App.allEnemies.forEach(function(enemy) {
                enemy.render();
            });

            App.entities.forEach(function(entity) {
                entity.render();
            });

            App.player.render();

        }

        function reset() {

            window.scrollTo(0, canvas.height);

        }

        return {
            init: init,
            ctx: ctx,
            ctxBkgnd: ctxBkgnd
        };

    })();

    Resources.onReady(Engine.init);

    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/wood-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png',
        'images/Key.png',
        'images/Heart.png',
        'images/Star.png',
        'images/Selector.png'
    ]);

    window.ctx = Engine.ctx;
    window.ctxBkgnd = Engine.ctxBkgnd;

});