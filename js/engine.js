requirejs.config({
    baseUrl: '/nanodegree/arcade-game/js'
});

require(['./app', './utils', './resources'], function(App, Utils, Resources) {

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
            paused = false,
            lastTime;

        doc.body.appendChild(canvasBkgnd);
        doc.body.appendChild(canvas);
        doc.body.appendChild(canvasInfo);

        function main() {

            var now = Date.now(),
                dt = paused ? 1 : (now - lastTime) / 1000.0;

            if(!paused) {
                update(dt);
                render();
            }

            lastTime = now;

            win.requestAnimationFrame(main);
        }

        function init() {

            console.log('Game init: ' + App.levels[App.getLevel()].cols + ' x ' + App.levels[App.getLevel()].rows.length);

            canvas.width = App.levels[App.getLevel()].cols * App.TILE_WIDTH;
            canvas.height = (App.levels[App.getLevel()].rows.length + 1) * (App.TILE_HEIGHT) + 5;

            canvasBkgnd.width = canvas.width;
            canvasBkgnd.height = canvas.height;

            canvasInfo.width = canvas.width +  App.TILE_WIDTH * 2;
            canvasInfo.height = canvas.height;

            ctxInfo.font = '48px Impact, Charcoal, sans-serif';
            ctxInfo.lineWidth = 2;
            ctxInfo.fillStyle = '#fff';
            ctxInfo.strokeStyle = '#000';

            reset();

        }

        function reset() {

            var width = App.TILE_WIDTH,
                height = App.TILE_HEIGHT,
                row, col, txtX;

            lastTime = Date.now();

            for (row = 0; row < App.levels[App.getLevel()].rows.length; row++) {
                for (col = 0; col < App.levels[App.getLevel()].cols; col++) {
                    ctxBkgnd.drawImage(Resources.get(App.rowImages[App.levels[App.getLevel()].rows[row]]),
                        col * width, row * height);
                }
            }

            if(App.getLevel() === 0) {

                txtX = canvasInfo.width / 2;
                paused = true;
                document.addEventListener('keyup', keyHandler, false);

                ctxInfo.textAlign = 'center';

                ctxInfo.fillText('Ready to Play?', txtX, 280);
                ctxInfo.strokeText('Ready to Play?', txtX, 280);

                ctxInfo.font = '36px Impact, Charcoal, sans-serif';

                ctxInfo.drawImage(Resources.get('images/start-key.png'), 210, 380);
                ctxInfo.fillText('Press Spacebar to Start!', txtX, 480);
                ctxInfo.strokeText('Press Spacebar to Start!', txtX, 480);

            } else {
                App.init();
            }

            window.scrollTo(0, canvas.height);

        }

        function keyHandler(e) {

            handleInput(Utils.keyHandler(e.keyCode));
        }

        function handleInput(key) {

            if(key === 'space') {

                document.removeEventListener('keyup', keyHandler, false);

                paused = false;

                App.reset();
                App.init();

                main();
            }
        }

        function update(dt) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            updateEntities(dt);
        }

        function updateEntities(dt) {

            var collision = false,
                drown = false;

            App.announcements.forEach(function(announce) {
                if(announce.remove) App.announcements.splice(App.announcements.indexOf(announce), 1);
                announce.update();
            });

            App.player.update(dt);

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

                if(App.player.lives === 0) {

                    App.gameOver();
                    paused = true;
                    document.removeEventListener('keyup', App.player.keyEventHandler, false);
                    document.addEventListener('keyup', keyHandler, false);

                } else {

                    App.tryAgain();
                    App.player.reset();

                }

                return;
            }

            App.collectibles.forEach(function(collectible) {

                if(collectible.remove) App.collectibles.splice(App.collectibles.indexOf(collectible), 1);

                collectible.update();

                if(App.player.checkCollision(collectible) && !collectible.collected) {
                    App.player.collectibles.push(collectible);
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

            var x = (App.levels[App.getLevel()].cols + 1) * App.TILE_WIDTH,
                livesTxt = 'Lives:',
                pointsTxt = App.points,
                collectibleY = 50;

            ctxInfo.clearRect(0, 0, canvasInfo.width, canvasInfo.height);

            ctxInfo.textAlign = 'end';
            ctxInfo.fillText(pointsTxt, x, 45);
            ctxInfo.strokeText(pointsTxt, x, 45);

            ctxInfo.textAlign = 'start';
            ctxInfo.fillText(livesTxt, App.TILE_WIDTH, 45);
            ctxInfo.strokeText(livesTxt, App.TILE_WIDTH, 45);

            for(var i = 0; i < App.player.lives; i++) {
                ctxInfo.drawImage(Resources.get('images/Heart.png'),
                    ctxInfo.measureText(livesTxt).width + 20 + App.TILE_WIDTH + i * 50, -10, App.TILE_WIDTH / 2, App.TILE_HEIGHT * 0.8);
            }

            App.player.collectibles.forEach(function(collectible) {
                ctxInfo.drawImage(Resources.get(collectible.sprite),
                    40, collectibleY, collectible.TILE_WIDTH / 2, (collectible.TILE_HEIGHT) * 0.8);
                collectibleY += collectible.TILE_HEIGHT * 0.5;
            });

            App.announcements.forEach(function(announce) {
                announce.render();
            });
        }

        function renderEntities() {


            App.collectibles.forEach(function(collectible) {
                collectible.render();
            });

            App.allEnemies.forEach(function(enemy) {
                enemy.render();
            });

            App.entities.forEach(function(entity) {
                entity.render();
            });

            App.allRafts.forEach(function(raft) {
                raft.render();
            });

            App.player.render();
        }

        return {
            init: init,
            ctx: ctx,
            ctxBkgnd: ctxBkgnd,
            ctxInfo: ctxInfo
        };

    })();

    window.ctx = Engine.ctx;
    window.ctxBkgnd = Engine.ctxBkgnd;
    window.ctxInfo = Engine.ctxInfo;

    Resources.onReady(Engine.init);

    Resources.load([
        'images/start-key.png',
        'images/player-keys.png',
        'images/selector-keys.png',
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

});