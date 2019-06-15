var Styx = Styx || {};
Styx.ui = Styx.ui || {};

Styx.ui.Renderer = class
{
	constructor()
	{
		this.game = game;
		this.fov = {};
		this.level = null;
		this.view = null;
	}

	calcVisible()
	{
		//ROT.RNG.setSeed(12345);
		var pos = this.game.player.pos;
		this.fov = {};

		var fov = new ROT.FOV.PreciseShadowcasting((x, y) => this.lightPasses(x,y) );
		fov.compute(pos.x, pos.y, 10, (x, y, r, vis) => this.writeFov(x, y, r, vis) );
	}

	lightPasses(x, y)
	{
		if (!this.view.pointInside(x, y)) return false;
		return !this.level.getXY(x, y, 'tile').is('wall');
	}

	writeFov(x, y, r, vis)
	{
		if (!this.view.pointInside(x, y)) return;
		this.fov[x + ',' + y] = true;
	}

	render(level, container, params)
	{
		this.level = level;
		this.view = params.view;
		this.calcVisible();

		$('#'+container).html(this._renderHtml());
	}

	_renderHtml(level, view)
	{
		var html = '';
		for (var y = 0; y < this.view.height; y++) {
			for (var x = 0; x < this.view.width; x++) {
				html += this._renderTile(this.level, x + this.view.x, y + this.view.y);
			}

			html += '<br>';
		}

		return html;
	}

	_renderTile(level, x, y)
	{
		if (!this.fov[x + ',' + y]) {
			return `<span class="ui-gray" data-pos="${x},${y}">*</span>`;
		}

		var r = {char: "?", color: "white" };
		var tile = level.getXY(x, y, 'tile');

		if (tile.actor && tile.actor.isVisible()) r = tile.actor.getAttrib('render');
		else if (tile.is("hiding")) r = tile.getAttrib('render');
		else if (tile.item)  r = tile.item.getAttrib('render');
		else r = tile.getAttrib('render');			
		
		return `<span class="ui-${r.color}" data-pos="${x},${y}">${r.char}</span>`;
	}

}