define(['./utils', './resources', './gameitem'], function(Utils, Resources, GameItem) {

'use strict';

	var Announce = function() {

        GameItem.MoveableItem.call(this);

        this.messages = [];
        this.life = 5000;
        this.sizes = [48];
        this.remove = false;
        this.sprite = '';

	};
    Announce.prototype = Object.create(GameItem.MoveableItem.prototype);
    Announce.constructor = Announce;

    Announce.prototype.render = function() {

        var self = this,
            lineY = 0,
            PADDING = 5,
            img = this.sprite ? Resources.get(this.sprite) : null;


        // Always center on the canvas
        this.x = ctxInfo.canvas.width / 2;
        this.y = ctxInfo.canvas.height / 2 - (this.messages.length * this.size / 2);
        if(img) this.y -= img.naturalHeight / 2;

        // only render if it should still be visible
        if(this.life > 0) {
            ctxInfo.save();
            ctxInfo.shadowColor = 'rgba(0,0,0,0.6)';
            ctxInfo.shadowBlur = 3;
            ctxInfo.shadowOffsetX = 0;
            ctxInfo.shadowOffsetY = 2;
            ctxInfo.textAlign = 'center';
            ctxInfo.lineWidth = 2;
            ctxInfo.globalAlpha = Math.min(this.life/1000, 1);
            this.messages.forEach(function(message) {
                ctxInfo.font = self.sizes[self.messages.indexOf(message)] + 'px Impact, Charcoal, sans-serif';
                ctxInfo.fillText(message, self.x, self.y + lineY);
                ctxInfo.strokeText(message, self.x, self.y + lineY);
                lineY += self.sizes[self.messages.indexOf(message)] + PADDING;
            });
            ctxInfo.restore();

            if(img) ctxInfo.drawImage(img, this.x - img.naturalWidth / 2, this.y + lineY);
        }

    };

    Announce.prototype.update = function() {
        var self = this;

        if(self.life > 0) {
            self.life -= 100;
            for(var i = 0; i < self.sizes.length; i++) {
                self.sizes[i] += self.life < 1000 ? 2 : 0;
            }
        } else {
            self.remove = true;
        }
    };

    Announce.prototype.reset = function() {
        this.life = 8000;
        this.size = 48;
    };


	return(Announce);
});