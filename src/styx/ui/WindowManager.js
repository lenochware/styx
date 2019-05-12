var Styx = Styx || {};
Styx.ui = Styx.ui || {};

Styx.ui.WindowManager = class
{
	constructor()
	{
		this.game = game;
		this.messages = "";
		this.templates = this.game.data["templates"];
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

	execute(command) {}

	message(m, cssClass = "msg")
	{
		this.messages += "<span class=\"{1}\">{0}</span>".format(m.capitalize(), cssClass);
	}

	_renderStatusBar(options) {}

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
	}

	_renderMessages(options)
	{
		//this.messages.scrollTop = this.messages.scrollHeight;
		$('#'+options.container).html(this.messages);
	}
}