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

	message(m, cssClass = "msg", args)
	{
		if (args) {
			m = m.format(args);
		}

		this.messages += "<span class=\"{1}\">{0}</span>".format(m.capitalize(), cssClass);
	}

	_renderInventory()
	{
		var p = this.game.get('player');

		this.openWindow('inventory', 600, 400, {
			template: 'inventory',
			player: p,
		});
	}

	_renderItemWindow(options)
	{
		this.openWindow('item-window', 400, 200, {
			template: 'item-window',			
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

	openWindow(id, width, height, content)
	{
		var win = new Styx.ui.Window(id, width, height, content);
		win.draw();
	}

	closeWindow()
	{
		var win = this.getActiveWindow();
		if (!win) return false;
		win.close();
		win = this.getActiveWindow();
		if (win) win.redraw();
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