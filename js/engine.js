var Engine = (function(global) {

    var self = this,
        doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        canvasBkgnd = doc.createElement('canvas'),
        ctxBkgnd = canvasBkgnd.getContext('2d'),
        lastTime;

    self.rows = 6;
    self.cols = 5;

    canvas.width = self.cols * GameItem.tileWidth;
    canvas.height = self.rows * GameItem.tileHeight;
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

        reset();
        lastTime = Date.now();

        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            row, col;

        for (row = 0; row < self.rows; row++) {
            for (col = 0; col < self.cols; col++) {
                ctxBkgnd.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
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
            if(enemy.checkCollision(App.allEnemies)) enemy.changeTrack();
        });
        if(!collision) App.player.update();
        else App.player.reset();

    }

    function render() {

        renderEntities();
    }

    function renderEntities() {

        App.allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        App.player.render();
    }

    function reset() {
        // noop
    }

    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png'
    ]);
    Resources.onReady(init);

    global.ctx = ctx;

    return {
        rows: self.rows,
        cols: self.cols
    }

})(this);