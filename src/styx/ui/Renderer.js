var Styx = Styx || {};
Styx.ui = Styx.ui || {};

Styx.ui.Renderer = class
{
	constructor()
	{
		this.game = game;
		this.db = this.game.get('dungeon-base');
	}

	render(level, container, param)
	{
		$('#'+container).html(this._renderHtml(level));
	}

	_renderHtml(level)
	{
		var html = '';
		for (var y = 0; y < level.size.height; y++) {
			for (var x = 0; x < level.size.width; x++) {
				html += this._renderTile(level, x, y);
			}

			html += '<br>';
		}

		return html;
	}

	_renderTile(level, x, y)
	{
		var r = {char: "?", color: "white" };
		var tile = level.get(x, y, 'tile-params');
		if (tile.actor) r = tile.actor.getAttrib('render');
		else if (tile.item)  r = tile.item.getAttrib('render');
		else r = this.db.getAttrib('tiles', tile.id, 'render');

		return `<span class=\"ui-${r.color}\">${r.char}</span>`;
	}

}