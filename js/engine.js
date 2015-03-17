requirejs.config({
    baseUrl: "/nanodegree/arcade-game/js"
});

require(['./app', './resources', './gameitem'], function(App, Resources, GameItem) {

    var Engine = (function() {

        var doc = document,
            win = window,
            canvas = doc.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            canvasBkgnd = doc.createElement('canvas'),
            ctxBkgnd = canvasBkgnd.getContext('2d'),
            lastTime;

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

            canvas.width = App.levels[App.level].cols * GameItem.GameItem.TILE_WIDTH;
            canvas.height = App.levels[App.level].rows.length * GameItem.GameItem.TILE_HEIGHT;
            canvasBkgnd.width = canvas.width;
            canvasBkgnd.height = canvas.height;

            document.body.appendChild(canvasBkgnd);
            document.body.appendChild(canvas);

            reset();

            lastTime = Date.now();

            var width = GameItem.GameItem.TILE_WIDTH,
                height = GameItem.GameItem.YPOS,
                rowImages, row, col;

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
            if(!collision) {
                App.collectibles.forEach(function(collectible) {
                    if(App.player.checkCollision(collectible)) {
                        App.points += collectible.points;
                        App.collectibles.splice(App.collectibles.indexOf(collectible), 1);
                        console.log(App.points);
                    }
                });
                App.player.update();
            } else {
                App.player.reset();
            }

        }

        function render() {

            renderEntities();
        }

        function renderEntities() {

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