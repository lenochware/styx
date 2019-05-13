var Styx = Styx || {};
Styx.ui = Styx.ui || {};

Styx.ui.WindowManager = class
{
	constructor()
	{
		this.game = game;
		this.messages = "";
		this.templates = this.game.data["templates"];
		this.opened = [];
	}

	render(id, options)
	{
		switch (id) {
			case 'statusbar': this._renderStatusBar(options); break;
			case 'sidebar': this._renderSideBar(options); break;
			case 'messages': this._renderMessages(options); break;
			default: throw `Unknown window type: ${id}`;
		}
	}

	execute(command)
	{
		switch(command.command) {
			case 'close-window':
				this.closeActiveWindow();
			break;			
			case 'inventory':
				this._renderInventory();
			break;				
			default: throw `Invalid command '${command.command}'.`;
		}
	}		

	message(m, cssClass = "msg")
	{
		this.messages += "<span class=\"{1}\">{0}</span>".format(m.capitalize(), cssClass);
	}

	_renderInventory()
	{
		var p = this.game.get('player');
		this.window('inventory', 600, 400, this.template('inventory', {
			player: {name: p.params.name, health: p.health} 			
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

		this.opened.push(id);
	}

	closeWindow(id)
	{
		$('#' + id).remove();
		$('#' + id + '-overlay').remove();
	}

	closeActiveWindow()
	{
		var id = this.opened.pop();
		if (!id) return false;
		this.closeWindow(id);
	}

	// popup(icon, title, desc, buttons)
	// {
	// 	this.window('popup', 500, 200, 
	// 		this.template('popup', {icon:icon,title:title,desc:desc,buttons:buttons})
	// 	);
	// }


	_renderMessages(options)
	{
		//this.messages.scrollTop = this.messages.scrollHeight;
		$('#'+options.container).html(this.messages);
	}
}