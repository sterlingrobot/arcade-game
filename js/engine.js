require(['app', 'resources', 'gameitem'], function(App, Resources, GameItem) {

    var Engine = function() {

        var doc = document,
            win = window,
            canvas = doc.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            canvasBkgnd = doc.createElement('canvas'),
            ctxBkgnd = canvasBkgnd.getContext('2d'),
            lastTime;

        canvas.width = App.levels[App.level].cols * GameItem.tileWidth;
        canvas.height = App.levels[App.level].rows.length * GameItem.tileHeight;
        canvasBkgnd.width = canvas.width;
        canvasBkgnd.height = canvas.height;

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

            console.log('Engine init');

            reset();

            lastTime = Date.now();

            var rowImages, row, col;

            for (row = 0; row < App.levels[App.level].rows.length; row++) {
                for (col = 0; col < App.levels[App.level].cols; col++) {
                    ctxBkgnd.drawImage(Resources.get(App.rowImages[App.levels[App.level].rows[row]]),
                        col * GameItem.tileWidth, row * GameItem.yPos);
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
                // if(App.player.checkCollision(App.gem)) App.gem = new Gem();
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
            // noop
        }

        return {
            init: init,
            ctx: ctx,
            ctxBkgnd: ctxBkgnd
        };

    };

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

});