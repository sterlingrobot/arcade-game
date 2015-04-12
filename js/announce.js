define(['./utils', './resources', './gameitem'], function(Utils, Resources, GameItem) {

'use strict';

	var Announce = function() {

        GameItem.MoveableItem.call(this);

        this.text = '';
        this.life = 4000;
        this.size = 48;
        this.remove = false;

	};
    Announce.prototype = Object.create(GameItem.MoveableItem.prototype);
    Announce.constructor = Announce;

    Announce.prototype.render = function() {

        // only render if it should still be visible
        if(this.life > 0) {
            ctxInfo.save();
            ctxInfo.shadowColor = 'rgba(0,0,0,0.5)';
            ctxInfo.shadowBlur = 3;
            ctxInfo.shadowOffsetX = 0;
            ctxInfo.shadowOffsetY = 2;
            ctxInfo.font = this.size + 'px Impact, Charcoal, sans-serif';
            ctxInfo.textAlign = 'center';
            ctxInfo.lineWidth = 2;
            ctxInfo.globalAlpha = Math.min(this.life/1000, 1);
            ctxInfo.fillText(this.text, this.x, this.y);
            ctxInfo.strokeText(this.text, this.x, this.y);
            ctxInfo.restore();
        }

    };

    Announce.prototype.update = function() {
        if(this.life > 0) {
            this.life -= 50;
            this.size += this.life < 1000 ? 2 : 0;
        } else {
            this.remove = true;
        }
    };

    Announce.prototype.reset = function() {
        this.life = 4000;
        this.size = 48;
    };


	return(Announce);
});