var Styx = Styx || {};
Styx.ui = Styx.ui || {};

Styx.ui.Renderer = class
{
	constructor()
	{
		this.game = game;
		this.level = null;
		this.view = null;
	}

	computeFov()
	{
		this.level.fov = {};
		var pos = this.game.player.pos;
		var fov = new ROT.FOV.PreciseShadowcasting((x, y) => this.lightPasses(x,y) );
		fov.compute(pos.x, pos.y, 50, (x, y, r, vis) => this.writeFov(x, y, r, vis) );
	}

	lightPasses(x, y)
	{
		if (!this.view.pointInside(x, y)) return false;
		return !this.level.getXY(x, y, 'tile').is('opaque');
	}

	writeFov(x, y, r, vis)
	{
		if (!this.view.pointInside(x, y)) return;
		this.level.fov[x + ',' + y] = true;
	}

	render(level, container, params)
	{
		this.level = level;
		this.view = params.view;
		this.computeFov();

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
		var r = {char: "?", color: "white" };
		var tile = level.getXY(x, y, 'tile');

		if (!level.isVisible(x,y)) {
			r = tile.getAttrib('render');
			return `<span class="ui-dark-gray" data-pos="${x},${y}">${r.char}</span>`;
		}

		if (tile.actor && tile.actor.isVisible()) r = tile.actor.getAttrib('render');
		else if (tile.is("hiding")) r = tile.getAttrib('render');
		else if (tile.item)  r = tile.item.getAttrib('render');
		else r = tile.getAttrib('render');			
		
		return `<span class="ui-${r.color}" data-pos="${x},${y}">${r.char}</span>`;
	}

}