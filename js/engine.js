requirejs.config({
    baseUrl: "/nanodegree/arcade-game/js"
});

require(['./app', './resources'], function(App, Resources) {

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
        info.id = "info";
        doc.body.appendChild(canvasBkgnd);
        doc.body.appendChild(canvas);

        function main() {

            var now = Date.now(),
                dt = (now - lastTime) / 1000.0;

            update(dt);
            render();

            lastTime = now;

            win.requestAnimationFrame(main);
        };

        function init() {

            console.log('Engine init: ' + App.levels[App.level].cols + ' x ' + App.levels[App.level].rows.length);

            canvas.width = App.levels[App.level].cols * App.TILE_WIDTH;
            canvas.height = App.levels[App.level].rows.length * (App.TILE_HEIGHT + 18);
            canvasBkgnd.width = canvas.width;
            canvasBkgnd.height = canvas.height;
            canvasInfo.width = canvas.width;
            canvasInfo.height = 200;

            reset();

            lastTime = Date.now();

            var width = App.TILE_WIDTH,
                height = App.TILE_HEIGHT,
                row, col;

            for (row = 0; row < App.levels[App.level].rows.length; row++) {
                for (col = 0; col < App.levels[App.level].cols; col++) {
                    ctxBkgnd.drawImage(Resources.get(App.rowImages[App.levels[App.level].rows[row]]),
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

            var collision = false;
            App.allEnemies.forEach(function(enemy) {
                enemy.update(dt);
                if(App.player.checkCollision(enemy)) collision = true;
                // if(enemy.checkCollision  (App.allEnemies)) enemy.changeTrack();
            });

            App.allRafts.forEach(function(raft) {
                raft.update(dt);
                if(App.player.checkCollision(raft)) {
                    App.player.isRafting(raft);
                }
            });

            if(!collision) {
                App.collectibles.forEach(function(collectible) {
                    if(collectible.remove) App.collectibles.splice(App.collectibles.indexOf(collectible), 1);
                    if(App.player.checkCollision(collectible) && !collectible.collected) {
                        collectible.collected = true;
                        collectible.callback(App);
                    }
                    collectible.update();
                });
                App.player.update();
            } else {
                App.player.loseLife();
                if(App.player.lives === 0) console.log('GAME OVER');
                else App.player.reset();
            }

        }

        function render() {

            renderInfo();
            renderEntities();
        }

        function renderInfo() {
            ctxInfo.clearRect(0, 0, canvasInfo.width, canvasInfo.height);
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
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png',
        'images/Key.png',
        'images/Heart.png',
        'images/Star.png',
    ]);

    window.ctx = Engine.ctx;
    window.ctxBkgnd = Engine.ctxBkgnd;

});