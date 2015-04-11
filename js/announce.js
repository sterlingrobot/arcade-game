define(['./utils', './resources', './gameitem'], function(Utils, Resources, GameItem) {

'use strict';

	var Announce = function() {

        GameItem.MoveableItem.call(this);

        this.x = 250;
        this.y = 200;
        this.text = '';
        this.life = 5000;

        this.render = function() {

            // only render if it should still be visible
            if(this.life > 0) {
                ctxInfo.save();
                ctxInfo.textAlign = 'center';
                ctxInfo.lineWidth = 2;
                ctxInfo.globalAlpha = Math.min(this.life/500, 1);
                ctxInfo.fillText(this.text, this.x, this.y);
                ctxInfo.strokeText(this.text, this.x, this.y);
                ctxInfo.restore();
            }

        };

        this.update = function(dt) {

             if(this.life > 0) this.life -= 1000 * dt;

        };

        this.reset = function() {
            this.life = 5000;
        }
	};
    Announce.prototype = Object.create(GameItem.MoveableItem.prototype);
    Announce.constructor = Announce;



	return(Announce);
});