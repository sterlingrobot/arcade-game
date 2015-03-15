define(function() {

	// Base class for all game items
	function GameItem() {

		this.tileWidth = 101;
		this.tileHeight = 101;
		this.yPos = 83;

	};

	/* So that we can call these properties staticly
	 *	create these vars on the object itself
	 */
	GameItem.TILE_WIDTH = 101;
	GameItem.TILE_HEIGHT = 101;
	GameItem.YPOS = 83;

	function MoveableItem() {

		GameItem.call(this);

	};

	return {
		GameItem: GameItem,
		MoveableItem: MoveableItem
	};

});