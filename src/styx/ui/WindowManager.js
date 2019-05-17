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

		this.window('inventory', 600, 400, {
			player: {name: p.params.name, health: p.health},
			backpack: inventory.backpack,
			body: inventory.body
		});
	}

	_renderItemWindow(options)
	{
		this.window('item-window', 400, 200, {
			item: options.item,
			key: options.key,
			actions: ['close-window', 'drop']
		});
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

	getActiveWindow()
	{
		if (this.windows.length == 0) return null;
		return this.windows[this.windows.length-1];
	}

	window(id, width, height, data)
	{
		this.createModal(id, width, height, this.template(id, data));
		data.id = id;
		this.windows.push(data);
	}

	createModal(id, width, height, html)
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
		.html(html)
		.appendTo('#game-container').show();
	}

	closeWindow()
	{
		var win = this.getActiveWindow();
		if (!win) return false;

		$('#' + win.id).remove();
		$('#' + win.id + '-overlay').remove();
		this.windows.pop();
	}

	closeAll()
	{
		while(this.windows.length) {
			this.closeWindow();			
		}
	}

	_renderMessages(options)
	{
		//this.messages.scrollTop = this.messages.scrollHeight;
		$('#'+options.container).html(this.messages);
	}
}