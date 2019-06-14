var Styx = Styx || {};
Styx.ui = Styx.ui || {};

Styx.ui.Renderer = class
{
	constructor()
	{
		this.game = game;
	}

	render(level, container, params)
	{
		$('#'+container).html(this._renderHtml(level, params.view));
	}

	_renderHtml(level, view)
	{
		var html = '';
		for (var y = 0; y < view.height; y++) {
			for (var x = 0; x < view.width; x++) {
				html += this._renderTile(level, x + view.x, y + view.y);
			}

			html += '<br>';
		}

		return html;
	}

	_renderTile(level, x, y)
	{
		var r = {char: "?", color: "white" };
		var tile = level.getXY(x, y, 'tile');

		if (tile.actor && tile.actor.isVisible()) r = tile.actor.getAttrib('render');
		else if (tile.is("hiding")) r = tile.getAttrib('render');
		else if (tile.item)  r = tile.item.getAttrib('render');
		else r = tile.getAttrib('render');			
		
		return `<span class="ui-${r.color}" data-pos="${x},${y}">${r.char}</span>`;
	}

}