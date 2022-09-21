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
		this.canvas = null;
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
		this.level.visited[x + ',' + y] = true;
	}


	render(panel)
	{
		this.level = panel.level;
		this.view = panel.view;

		if (!panel.canvas) {
			panel.canvas = new Styx.ui.Canvas('#' + panel.container);
			panel.canvas.setFont("bold 18px monospace");
			//panel.canvas.focus();
		}

		this.canvas = panel.canvas;
		this.canvas.clear();
		this.canvas.applyTransform();
	
		this.computeFov();

		for (var y = 0; y < this.view.height; y++) {
			for (var x = 0; x < this.view.width; x++) {
				this.renderTile(x, y);
			}
		}
	}

	renderTile(x, y)
	{
		var r = {char: "?", color: "white" };
		var tile = this.level.getXY(x + this.view.x, y + this.view.y, 'tile');

		if (!this.level.isVisible(x + this.view.x, y + this.view.y)) {
			r = tile.getAttrib('render');

			if (!this.level.visited[(x + this.view.x) + ',' + (y + this.view.y)]) return;

			this.canvas.text(x * this.canvas.tileWidth, y * this.canvas.tileHeight, '#666', r.char);
			return;
		}

		if (tile.actor && tile.actor.isVisible() && !tile.actor.isBuried()) r = tile.actor.getAttrib('render');
		else if (tile.is("hiding")) r = tile.getAttrib('render');
		else if (tile.item)  r = tile.item.getAttrib('render');
		else r = tile.getAttrib('render');

		this.canvas.text(x * this.canvas.tileWidth, y * this.canvas.tileHeight, Styx.ui.colors[r.color] || r.color, r.char);
	}
}

Styx.ui.colors = {
	'green': '#00ff00',
	'dark-green': '#00af5f',
	'yellow': '#ffff00',
	'brown': '#d7af5f',
	'dark-brown': '#af5f00',
	'red': '#d70000',
	'pink': '#d7005f',
	'purple': '#ff00ff',
	'cyan': '#00ffff',
	'light-blue': '#5fffd7',
	'blue': '#5c5cff',
	'gray': '#979797',
	'dark-gray': '#575757'
}