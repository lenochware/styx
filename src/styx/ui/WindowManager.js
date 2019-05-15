var Styx = Styx || {};
Styx.ui = Styx.ui || {};

Styx.ui.WindowManager = class
{
	constructor()
	{
		this.game = game;
		this.messages = "";
		this.templates = this.game.data["templates"];
		this.windows = [];
		this.activeWindow = null;
	}

	render(id, options)
	{
		switch (id) {
			case 'statusbar': this._renderStatusBar(options); break;
			case 'sidebar': this._renderSideBar(options); break;
			case 'messages': this._renderMessages(options); break;
			case 'inventory': this._renderInventory(options); break;
			case 'item-window': this._renderItemWindow(options); break;
			default: throw `Unknown window type: ${id}`;
		}
	}

	message(m, cssClass = "msg")
	{
		this.messages += "<span class=\"{1}\">{0}</span>".format(m.capitalize(), cssClass);
	}

	_renderInventory()
	{
		var p = this.game.get('player');
		var inventory = p.inventory.getContent();

		this.window('inventory', 600, 400, this.template('inventory', {
			player: {name: p.params.name, health: p.health},
			backpack: inventory.backpack,
			body: inventory.body,
			})
		);
	}

	_renderItemWindow(options)
	{
		this.window('item-window', 400, 200, this.template('item-window', {
			item: options.item,
			})
		);
	}

	_renderSideBar(options)
	{
		var p = this.game.get('player');
		$('#'+options.container).html(this.template('sidebar', {
			player: {name: p.params.name, health: p.health} 
		}));
	}

	template(id, data)
	{
		if (!this.templates[id]) {
			throw new Error(`Template '${id}' not found.`);
		}

		return _.template(this.templates[id])(data);
	}

	window(id, width, height, content)
	{
		if ($('#'+id).length) {
			this.game.debugLog(`Window '${id}' already exists.`);
			return;
		}

		var over = document.createElement('div');
		$(over).addClass("ui-overlay")
		.click(() => this.closeWindow(id))
		.attr("id", id + "-overlay")
		.appendTo('#game-container');

		var d = document.createElement('div');
		$(d).addClass("ui-window")
		.attr("id", id)
		.width(width)
		.height(height)
		.html(content)
		.appendTo('#game-container').show();//fadeIn(200);

		this.windows.push(id);
		this.activeWindow = id;
	}

	closeWindow()
	{
		var id = this.windows.pop();
		if (!id) return false;

		$('#' + id).remove();
		$('#' + id + '-overlay').remove();
		this.activeWindow = this.windows.length? this.windows[this.windows.length-1] : null;
	}

	_renderMessages(options)
	{
		//this.messages.scrollTop = this.messages.scrollHeight;
		$('#'+options.container).html(this.messages);
	}
}