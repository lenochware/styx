var Styx = Styx || {};
Styx.ui = Styx.ui || {};

Styx.ui.Window = class
{
	constructor(id, width, height, content)
	{
		this.game = game;
		this.wm = this.game.get('window-manager');
		this.id = id;
		this.width = width;
		this.height = height;
		this.content = content;

		this.HTML_CLOSE_BUTTON = '<div class="close-btn command" data-key="Escape" title="Close">[x]</div>';
	}

	draw()
	{
		var html = this.content['html'] || this.wm.template(this.content['template'], this.content);
		this.createModal(html);
		this.wm.windows.push(this);
	}

	redraw()
	{
		var html = this.content['html'] || this.wm.template(this.content['template'], this.content);
		$('#'+this.id).html(html + this.HTML_CLOSE_BUTTON);
	}

	createModal(html)
	{
		if ($('#'+this.id).length) {
			this.game.debugLog(`Window '${this.id}' already exists.`);
			return;
		}

		var over = document.createElement('div');
		$(over).addClass("ui-overlay")
		.click(() => this.close())
		.attr("id", this.id + "-overlay")
		.appendTo('#game-container');

		var d = document.createElement('div');
		$(d).addClass("ui-window")
		.attr("id", this.id)
		.width(this.width)
		.height(this.height)
		.html(html + this.HTML_CLOSE_BUTTON)
		.appendTo('#game-container').show();
	}

	close()
	{
		$('#' + this.id).remove();
		$('#' + this.id + '-overlay').remove();

		var active = this.wm.windows;
		this.wm.windows = _.without(active, _.findWhere(active, {
		  id: this.id
		}));
	}
}