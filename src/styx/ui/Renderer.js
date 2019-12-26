var Styx = Styx || {};
Styx.ui = Styx.ui || {};

/**
 * Renderer.render() draw view (rectangle) of the level on the screen.
 * This renderer uses text/html format - it can be replaced with graphic renderer in future.
 * Each object keep its visuals in "render" attribute.
 */
Styx.ui.Renderer = class
{
	constructor()
	{
		this.game = game;
		this.level = null;
		this.view = null;
		this.canvas = new Styx.ui.Canvas('#level-map', 800, 600);
		this.canvas.setFont("bold 20px monospace");
		this.setTileSize(15, 20);
	}

	setTileSize(w, h)
	{
		this.tileWidth = w;
		this.tileHeight = h;
	}

	getTileCoords(mouseX, mouseY)
	{
		return {x: Math.floor(mouseX / this.tileWidth), y: Math.floor(mouseY / this.tileHeight) }
	}

	computeFov()
	{
		this.level.fov = {};
		if (!this.game.player) {
			console.warn('No player - skipped fov calc.');
			return;
		}

		var pos = this.game.player.pos;
		var fov = new ROT.FOV.PreciseShadowcasting((x, y) => this.lightPasses(x,y) );
		fov.compute(pos.x, pos.y, 50, (x, y, r, vis) => this.writeFov(x, y, r, vis) );
	}

	lightPasses(x, y)
	{
		if (!this.view.isInsidePoint(x, y)) return false;
		return !this.level.getXY(x, y, 'tile').is('opaque');
	}

	writeFov(x, y, r, vis)
	{
		if (!this.view.isInsidePoint(x, y)) return;
		this.level.fov[x + ',' + y] = true;
	}


	render(level, container, view)
	{
		this.level = level;
		this.view = view;

		this.canvas.clear();
		// this.rect(0,0,50,50, '#fc1090');
		// this.text(50,50, 'pink', 'Hello world');
		
		this.computeFov();

		for (var y = 0; y < this.view.height; y++) {
			for (var x = 0; x < this.view.width; x++) {
				this.renderTile(x + this.view.x, y + this.view.y);
			}
		}		

	}

	renderTile(x, y)
	{
		var r = {char: "?", color: "white" };
		var tile = this.level.getXY(x, y, 'tile');

		if (!this.level.isVisible(x,y)) {
			r = tile.getAttrib('render');
			this.canvas.text(x* this.tileWidth, y * this.tileHeight + 30, 'gray', r.char);
			return;
		}

		if (tile.actor && tile.actor.isVisible()) {
			r = tile.actor.getAttrib('render');
			if(r.char != '@') debugger;
		}
		else if (tile.is("hiding")) r = tile.getAttrib('render');
		else if (tile.item)  r = tile.item.getAttrib('render');
		else r = tile.getAttrib('render');

		this.canvas.text(x * this.tileWidth, y * this.tileHeight + 30, 'white', r.char);
	}
}