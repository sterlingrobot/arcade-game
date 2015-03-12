// Base class for all game items
var GameItem = function() {

	this.tileWidth = 101;
	this.tileHeight = 101;

};
/* So that we can call these properties staticly
 *	create these vars on the object
 */
GameItem.tileWidth = 101;
GameItem.tileHeight = 101;

var MoveableItem = function() {

	GameItem.call(this);
	this.yPos = 83;

};